import express from 'express';
import { Forum } from "./Forum.js";

const forumRouter = express.Router();


export function viewForum(req, res) {
    
        let contenido = 'pages/forum';
    
        let id = req.params.game_id;
        
        const threadList = Forum.getThreadsByGame(id);
        res.render('page', {
            contenido,
            session: req.session,
            threadList: threadList
        });
}

export function loadThread(req, res) {
    let cantidad = 3;
    let contenido = 'pages/loadThread';
    const { game_id, thread_id, offset } = req.params;
    const threadList = Forum.getThreadById(parseInt(game_id), parseInt(thread_id),cantidad, parseInt(offset));
    const num_replies = Forum.getReplies(thread_id);
    if (!threadList) {
        return res.status(404).send("Post no encontrado");
    }
    res.render('p', { 
        contenido,
        session: req.session,
        threadList,
        game_id: game_id,
        last_id: thread_id,
        last_position: parseInt(offset) + parseInt(cantidad),
        num_replies: num_replies[0].replies
     });
}

export function doCreateReply(req, res) {
    const { game_id, thread_id } = req.params;
    const { message } = req.body;
    const user = req.session.login;

    if (!user) {
        return res.status(401).send("No autenticado");
    }

    if (!message || message.trim() === '') {
        return res.status(400).send("Mensaje vacío");
    }

    try {
        Forum.createReply(parseInt(game_id), parseInt(thread_id), message, user.id);
        res.redirect(`/forum/${game_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al guardar la respuesta");
    }
}   
export function doDeletebyId(req, res) {
    const { game_id, thread_id } = req.params;
    const { confirmText } = req.body;
    const isAdmin = req.session.esAdmin;

    if (!isAdmin) {
        return res.status(403).send("No autorizado");
    }

    if (confirmText !== "DELETE") {
        return res.status(400).send("Confirmación inválida");
    }

    try {
        Forum.delete(parseInt(game_id), parseInt(thread_id));
        res.redirect(`/forum/${game_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar el post");
    }
}