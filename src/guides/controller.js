import express from 'express';
import {Guides} from "./Guides.js";
import {logger} from "../logger.js";
import {Game} from "../games/Game.js";
import {getCurrentUTCTime} from "../games/controller.js";

const guidesRouter = express.Router();

export function viewAddGuide(req, res) {
    const gameId = req.params.game_id;
    const userId = req.session.UserID;

    console.log("VIEW ADD GUIDE");
    console.log(req.session);
    console.log(userId);

    if (!userId) {
        return res.redirect('/users/login');
    }

    try {
        const game = Game.getGameById(gameId);

        if (!game) {
            logger.error(`Juego no encontrado`);
            return res.status(404).render('pages/error', {message: 'Game not found'});
        }

        res.render(req, res, 'pages/guides/addGuide', {
            errores: {},
            info: {},
            gameId: gameId,
            userId: userId,
            game: game
        });

    } catch (e) {
        logger.error(`Error, faltan datos `);
        res.status(500).render('pages/error', {message: 'Error loading guide creation page.'});
    }
}

export function doAddGuide(req, res) {
    const gameId = req.body.game_id;
    const userId = req.body.user_id;
    const content = req.body.content;
    const date = getCurrentUTCTime();

    if (!gameId || !userId) {
        logger.error("gameId o userId no encontrados");
        return res.redirect('/games/listajuegos');
    }

    try {
        const guide = new Guides(null, userId, gameId, date, content);
        Guides.insertGuide(guide);

        return res.redirect(`/games/${gameId}`);
    } catch (e) {
        logger.error('Error insertando guia');
        logger.debug('Excepcion al insertar guia');

        res.render(req, res, 'pages/guides/addGuide', {
            errores: {},
            error: 'No se pudo guardar la guia',
            info: { content },
            gameId,
            userId,
            game: Game.getGameById(gameId)
        });
    }
}
