import express from 'express';
import { Forum } from "./Forum.js";
import {body} from 'express-validator';

const forumRouter = express.Router();


export function viewForum(req, res) {
    
        let contenido = 'pages/forum';
    
        let id = req.params.game_id;
        
        const threadList = Forum.getThreadsByGame(id);
        res.render('page', {
            contenido,
            session: req.session,
            threadList: threadList,
            game_id: id
        });
}

export function loadThread(req, res) {
    let cantidad = 3;
    let contenido = 'pages/loadThread';
    const { game_id, thread_id, offset } = req.params;
    const threadList = Forum.getThreadById(parseInt(game_id), parseInt(thread_id),cantidad, parseInt(offset));
    const num_replies = Forum.getReplies(thread_id,game_id);

    if (!threadList) {
        return res.status(404).send("Post no encontrado");
    }
    res.render('p', { 
        contenido,
        session: req.session,
        threadList,
        game_id: game_id,
        last_id: thread_id,
        last_position: parseInt(offset) - parseInt(cantidad),
        num_replies: num_replies
     });
}

export function doCreateReply(req, res) {
    console.log("body: ", req.body);
    const { game_id, thread_id } = req.params;
    console.log("game_id: ", game_id);
    console.log("thread_id: ", thread_id);
    if (!game_id || !thread_id) {return;}
    body("reply-title").escape();
    body("reply-message").escape();
    
    let title = ""
    try {
        title = req.body["reply-title"].trim();
    } catch (error) {
        const post = Forum.getPostById(thread_id);
        if (!post) {
            return res.status(404).send("Post no encontrado");
        }
        title = "Re:" + post.title;
    }
    const message = req.body["reply-message"].trim();
    const user = req.session;

    if (!user.login) {
        return res.status(401).send("No autorizado");
    }   
    if (!message || message.trim() === '') {
        return res.status(400).send("Mensaje vacío");
    }
    if (!title || title.trim() === '') {
        return res.status(400).send("Título vacío");
    }
    try {
        Forum.createReply(parseInt(game_id), parseInt(thread_id), title, message, user.UserID);
        res.redirect(`/games/${game_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al guardar la respuesta");
    }
}
export function doEditbyId(req, res) {
    const { game_id, thread_id } = req.params;
    const post = Forum.getPostById(thread_id);
    body("edit-title").escape();
    body("edit-message").escape();
    const title = req.body["edit-title"].trim();
    const message = req.body["edit-message"].trim();
    if (!message || message.trim() === '') {
        return res.status(400).send("Mensaje vacío");
    }
    if (!title || title.trim() === '') {
        return res.status(400).send("Título vacío");
    }
    if (!post) {
        return res.status(404).send("Post no encontrado");
    }
    if (!req.session.esAdmin  && req.session.UserID != post.user_id) {
        console.log("User id: ", req.session.UserID);
        console.log("Post user id: ", post.user_id);
        return res.status(403).send("No autorizado");
    }
    try {
        Forum.updatePost(parseInt(thread_id), req.body["edit-title"], req.body["edit-message"]);
        res.redirect(`/games/${game_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar la respuesta");
    }
}
export function doDeletebyId(req, res) {
    const { game_id, thread_id } = req.params;
    const confirmText = req.body['confirm-text'];
    const isAdmin = req.session.esAdmin;
    console.log("body: ", req.body);
    console.log("confimrText: ", confirmText);
    if (!isAdmin) {
        return res.status(403).send("No autorizado");
    }

    if (confirmText !== "DELETE") {
        console.log("Confirmación inválida:", confirmText);
        return res.status(400).send("Confirmación inválida");
    }

    try {
        Forum.delete(parseInt(game_id), parseInt(thread_id));
        res.redirect(`/games/${game_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar el post");
    }
}