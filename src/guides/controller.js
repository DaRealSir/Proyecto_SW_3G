import express from 'express';
import {Guides} from "./Guides.js";
import {logger} from "../logger.js";
import {Game} from "../games/Game.js";
import {getCurrentUTCTime} from "../games/controller.js";
import {render} from "../utils/render.js";
import {User} from "../users/User.js";
const guidesRouter = express.Router();

export function viewAddGuide(req, res) {
    const gameId = req.params.game_id;
    const userId = req.session.UserID;

    console.log("VIEW ADD GUIDE");
    console.log(gameId);
    console.log(userId);

    if (!userId) {
        return res.redirect('/users/login');
    }

    try {
        const game = Game.getGameById(gameId);
        console.log(game);
        if (!game) {
            logger.error(`Juego no encontrado`);
            return res.status(404).render('pages/error', {message: 'Game not found'});
        }
        //const guide = Guides.getGuideById(guideId);

        render(req, res, 'pages/guides/addGameGuide', {
            errores: {},
            info: {},
            gameId: gameId,
            userId: userId,
            game: game
        });

    } catch (e) {
        logger.error(`Error, faltan datos , ${e.message}`);
        res.status(500).render('pages/error', {message: 'Error loading guide creation page.'});
    }
}

export function doAddGuide(req, res) {
    const gameId = req.body.game_id;
    const userId = req.body.user_id;
    const content = req.body.content;
    const title = req.body.title;
    const guide_type = req.body.guide_type;
    const date = getCurrentUTCTime();


    if (!gameId || !userId) {
        logger.error("gameId o userId no encontrados");
        return res.redirect('/games/listajuegos');
    }

    try {
        const guide = new Guides(null, userId, gameId, date, content, title, guide_type);
        Guides.insertGuide(guide);

        return res.redirect(`/games/${gameId}`);
    } catch (e) {
        logger.error(`Error insertando guia, (Game ID: ${gameId}): ${e.message}`);
        logger.debug('Excepcion al insertar guia');

        let contenido = 'pages/guides/addGameGuide';

        render(req, res, contenido, {
            errores: {},
            error: 'No se pudo guardar la guia',
            info: { content },
            gameId,
            userId,
            game: Game.getGameById(gameId)
        });
    }
}

export function listGuidesByGameId(req, res) {
    const gameId = req.params.game_id;

    if(!gameId) {
        logger.error("gameId no encontrado");
        return res.status(404).render('pages/error', {message: 'Game not found'});
    }

    try{
        const guideList = Guides.getGuideByGame(gameId);
        render(req, res, 'pages/guides/listGuides', {
            guidesList: guideList,
            gameId
        });
    } catch (e) {
        logger.error(`Error getting guides for game ${gameId}: ${e.message}`);
        res.status(500).render('pages/error', {message: 'Error loading guides'});
    }
}

export function showFullGuide(req, res){
    const guideId = req.params.guide_id;

    if (!guideId) {
        logger.error('guide_id no encontrado');
        return res.status(404).render('pages/error', { message: 'Guía no encontrada' });
    }

    try {
        const guide = Guides.getGuideById(guideId);

        console.log("GUIA");
        console.log(guide);
        const user = User.getUserByID( guide._user_id);
        guide._user_name = user.username || user.name;

        const game = Game.getGameById(guide._game_id);
        guide._game_title = game.title;

        console.log("GUIA");
        console.log(guide);

        if (!guide) {
            logger.warn(`No existe la guía con ID ${guideId}`);
            return res.status(404).render('pages/error', { message: 'Guía no encontrada' });
        }

        return render(req, res, 'pages/guides/fullGuide', { guide });
    } catch (e) {
        logger.error(`Error al obtener la guía ${guideId}: ${e.message}`);
        return res.status(500).render('pages/error', { message: 'Error al cargar la guía completa' });
    }
}