import express from 'express';
import {Guides} from "./Guides.js";
import {logger} from "../logger.js";
import {Game} from "../games/Game.js";
import {getCurrentUTCTime} from "../games/controller.js";
import {render} from "../utils/render.js";
import {User} from "../users/User.js";
const guidesRouter = express.Router();

export function viewAddGuide(req, res) {
    const gameId  = req.params.game_id;
    const userId  = req.session.UserID;
    const editId  = req.query.guide_id;

    if (!userId) return res.redirect('/users/login');

    try {
        const game = Game.getGameById(gameId);
        if (!game) return res.status(404).render('pages/error', { message: 'Game not found' });

        let info = { title: '', content: '', guide_type: 'G' };
        if (editId) {
            const guide = Guides.getGuideById(editId);
            // Cambiar guide.user_id por guide._user_id para coincidir con el formato usado
            if (parseInt(guide._user_id) !== parseInt(userId)) {
                return res.status(403).render('pages/error', { message: 'No permitido' });
            }

            info = {
                title: guide._title, // Cambiar guide.title por guide._title
                content: guide._content, // Cambiar guide.content por guide._content
                guide_type: guide._guide_type, // Cambiar guide.guide_type por guide._guide_type
                guide_id: guide.id // Mantener guide.id ya que así se usa en las vistas
            };
        }

        return render(req, res, 'pages/guides/addGameGuide', {
            errores: {},
            info,
            gameId,
            userId,
            game
        });
    } catch (e) {
        logger.error(`Error loading guide page: ${e.message}`);
        return res.status(500).render('pages/error', { message: 'Error loading guide creation page.' });
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

        const user = User.getUserByID( guide._user_id);
        guide._user_name = user.username || user.name;

        const game = Game.getGameById(guide._game_id);
        guide._game_title = game.title;


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

export function doEditGuide(req, res) {
    const { guide_id, game_id, user_id, title, content, guide_type } = req.body;
    if (parseInt(user_id) !== req.session.UserID) {
        return res.status(403).render('pages/error', { message: 'No autorizado' });
    }

    try {
        const stmt = Guides.getUpdateStmt();
        stmt.run({ id: guide_id, title, content, guide_type });

        return res.redirect(`/guides/${guide_id}`);
    } catch (e) {
        logger.error(`Error al editar guía ${guide_id}: ${e.message}`);
        return viewAddGuide(req, res);
    }
}