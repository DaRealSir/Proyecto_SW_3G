import express from 'express';
import {Game} from "./Game.js";
import {Review} from "../reviews/Review.js";
import {Genre} from "../genres/Genre.js"
import{Shop} from "../shop/Shop.js";
import {Company} from "../companies/Company.js"
import { render } from '../utils/render.js';
import { validationResult, matchedData } from 'express-validator';

import {logger} from '../logger.js';
import {Forum} from '../forum/Forum.js';
import {Guides} from "../guides/Guides.js";

const juegosRouter = express.Router();


export function showGameList(req, res) {

    let page = 1;
    if (req.params.numPage) {
        page = parseInt(req.params.numPage, 10);
    }

    // 4 para pruebas,  16 de normal
    let numGamesPerPage = 4;

    const gameList = Game.getSearchedGameList("", "title", "DESC", numGamesPerPage, (page - 1) *numGamesPerPage);
    const genres = Genre.getAllGenres();
    render(req, res, 'pages/listajuegos', {
        errores: {},
        info: {},
        gameList: gameList,
        page,
        filtersValues: {},
        genreList: genres
    });
}

export function showGameListSearched(req, res) {
    let page = 1;
    if (req.params.numPage) {
        page = parseInt(req.params.numPage, 10);
    }

    // 4 para pruebas,  16 de normal
    let numGamesPerPage = 4;

    const title = req.body.game_title.trim();
    const order_option = req.body.order_option;
    let order;
    switch (order_option) {
        case "optionAlfabetico":
            order = "title";
            break;
        case "optionNota":
            order = "rating";
            break;
        case "optionNumFavoritos":
            order = "favNumber";
            break;
        default:
            order = "title";
            break;
    }

    const asc_desc_option = req.body.asc_desc_option;
    let order_dir;
    switch (asc_desc_option) {
        case "optionDesc":
            order_dir = "DESC";
            break;
        case "optionAsc":
            order_dir = "ASC";
            break;
        default:
            order_dir = "DESC";
            break;
    }

    const genre_option = req.body.genre_option;
    let gameList;

    // 3 para pruebas,  15 de normal
    if (genre_option === undefined || genre_option === "Cualquiera") {
        gameList = Game.getSearchedGameList(title, order, order_dir, numGamesPerPage, (page - 1) * numGamesPerPage, 0);
    } else {
        const genre = Genre.getGenreByName(genre_option)
        const genre_id = genre.id;
        gameList = Game.getSearchedGameList(title, order, order_dir, numGamesPerPage, (page - 1) * numGamesPerPage, genre_id);
    }

    const genres = Genre.getAllGenres();
    render(req, res, 'pages/listajuegos', {
        errores: {},
        info: {},
        gameList: gameList,
        page,
        genreList: genres,
        filtersValues: {
            title: title,
            order_option: order_option,
            asc_desc_option: asc_desc_option,
            genre_option: genre_option
        }
    })
}

export function showGameInfo(req, res) {

    let contenido = 'pages/game';

    let id = req.params.id;

    const game = Game.getGameById(id);
    const reviewListByGameId = Review.getAllReviewsByGameId(id);
    const guidesListByGameId = Guides.getGuideByGame(id);
    const genres = Genre.getGameGenres(game);
    const threadList = Forum.getThreadsByGame(id);
    const shopList = Shop.getShopListByGameId(id);
    const developerCompany = Company.getGameCompanies(game,'developer');
    const publisherCompany = Company.getGameCompanies(game,'publisher');
    render(req, res, contenido, {
        game: game,
        reviewList: reviewListByGameId,
        guidesList: guidesListByGameId,
        genreList: genres,
        threadList: threadList,
        shopList: shopList,
        developerCompany: developerCompany,
        publisherCompany: publisherCompany,
        game_id: id
    });

}

export function addShopView(req, res) {

    const id = req.params.id;
    const game = Game.getGameById(id);
    const contenido = 'pages/addShopToGame';
    const shopList = Shop.getAllShops();
    render(req, res, contenido, {
        errores: {},
        info: {},
        shopList: shopList,
        game: game
    });
}

export function addShopDo(req, res) {

    
    const id = req.params.id;
    const shop_option = req.body.shop_option;
    const shop = Shop.getShopByName(shop_option);
    const url = req.body.url.trim();
    Game.addShopToGame(id, shop, url);
    const game = Game.getGameById(id);
    const shopList = Shop.getShopListByGameId(id);
    const reviewListByGameId = Review.getAllReviewsByGameId(id);
    const genres = Genre.getGameGenres(game);
    const threadList = Forum.getThreadsByGame(id);
    const guidesListByGameId = Guides.getGuideByGame(id);
    const contenido = 'pages/game';

    const developerCompany = Company.getGameCompanies(game,'developer');
    const publisherCompany = Company.getGameCompanies(game,'publisher');
    render(req, res, contenido, {
        errores: {},
        info: {},
        shopList: shopList,
        game: game,
        reviewList: reviewListByGameId,
        developerCompany: developerCompany,
        publisherCompany: publisherCompany,
        guidesList: guidesListByGameId,
        genreList: genres,
        threadList: threadList,
        game_id: id
    });
}

export function viewAddGameBD(req, res) {

    let contenido = 'pages/addGameForm/addGamePage';
    let genreList = Genre.getAllGenres();
    render(req, res, contenido, {
        errores: {},
        info: {},
        genreList: genreList
    });
}


export function doAddGameBD(req, res) {


    const result = validationResult(req);

    const title = req.body.title.trim();
    const description = req.body.description.trim();
    const rating = Number(req.body.rating.trim());
    const favNumber = parseInt(req.body.favNumber.trim());
    const company_id = parseInt(req.body.company_id.trim());
    const url_image = req.body.url_image.trim();
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
         let genreList = Genre.getAllGenres();
        return render(req, res, 'pages/addGameForm/addGamePage', {
            datos,
            errores,
            error: "Datos erroneos",
            genreList: genreList,
            info: {
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image,
                company_id: company_id
            }
        });
    }

    try {
        const game = new Game(title, description, rating, favNumber, url_image, company_id, null);

        const game2 = Game.insert(game);
         let genreList = Genre.getAllGenres();

        render(req, res, 'pages/addGameForm/addGamePage', {
            errores: {},
            exito: 'Juego insertado con exito en la Base de Datos',
            genreList: genreList,
            info: {},
            game : game2,
        });


    } catch (e) {


        logger.error(e);
        logger.error(`Error al hacer inserción de juego ${title}`);
        logger.debug(`Excepcion al hacer inserción de juego ${title}`);

        let error = 'No se ha podido insertar juego';

        render(req, res, 'pages/addGameForm/addGamePage', {
            error,
            datos: {},
            errores: {},
            info: {
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image,
                company_id: company_id
            }
        });
    }
}

export function viewModifyGameBD(req, res) {

    const gameId = req.params.id;
    const game = Game.getGameById(gameId);

    let contenido = 'pages/modifyGamePage';

    render(req, res, contenido, {
        errores: {},
        info: {
            title: game.title,
            description: game.description,
            rating: game.rating,
            favNumber: game.favNumber,
            url_image: game.image,
            company_id: game.company
        },
        game: game
    });
}


export function doModifyGameBD(req, res) {

    const title = req.body.title.trim();
    const gameId = req.params.id;
    const description = req.body.description.trim();
    const rating = Number(req.body.rating.trim());
    const favNumber = parseInt(req.body.favNumber.trim());
    const company_id = parseInt(req.body.company_id.trim());
    const url_image = req.body.url_image.trim();

    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/modifyGamePage', {
            datos,
            errores,
            info: {
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image,
                company_id: company_id,
                url_image: url_image
            },
            game: {
                id: gameId
            }
        });
    }

    try {
        const new_info_game = new Game(title, description, rating, favNumber, url_image, company_id, null);

        const game2 = Game.update(gameId, new_info_game);
        const reviewListByGameId = Review.getAllReviewsByGameId(gameId);
        const genres = Genre.getGameGenres(game2);
        const threadList = Forum.getThreadsByGame(gameId);
        const shopList = Shop.getShopListByGameId(gameId);
        const developerCompany = Company.getGameCompanies(game2,'developer');
        const publisherCompany = Company.getGameCompanies(game2,'publisher');
         const guidesListByGameId = Guides.getGuideByGame(gameId);
        render(req, res, 'pages/game', {
            errores: {},
            exito: 'Juego modificado con exito en la Base de Datos',
            game: game2,
            reviewList: reviewListByGameId,
            genreList: genres,
            threadList: threadList,
             shopList: shopList,
            developerCompany: developerCompany,
            publisherCompany: publisherCompany,
             guidesList: guidesListByGameId,
             game_id: gameId
        });


    } catch (e) {

        //const reviewListByGameId = Review.getAllReviewsByGameId(gameId);
        //const genres = Genre.getGameGenres(game);
        //const threadList = Forum.getThreadsByGame(gameId);

        render(req, res, 'pages/modifyGamePage', {
            errores: {},
            error: 'ERROR al modificar juego en la Base de Datos',
            info: {
                id: gameId,
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image,
                company_id: company_id,
            },
            game: {
                id: gameId
            }
        });
    }
}

export function doDelete(req, res) {
    const id = req.params.id;

    try {
        Game.deleteById(id);

        return showGameList(req, res);
    } catch (e) {

        return showGameList(req, res);
    }

}

export function deleteReview(req, res) {

    const reviewId = req.params.id;
    const userId = req.session.UserID;

    if (!reviewId) {
        console.error("Review ID no encontrado en la ruta");
        return res.redirect('/games/listajuegos');
    }

    try {
        Review.deleteReview(reviewId);

        return res.redirect('/games/listajuegos');

    } catch (e) {
        logger.error(`Error al intentar borrar la review ${reviewId}: ${e.message}`);
        return res.render('pages/error', {message: 'No se pudo borrar la review.'});
    }
}

export function viewAddReview(req, res) {

    const gameId = req.params.game_id;
    const userId = req.session.UserID;

    if (!userId) {
        logger.warn('Intento de acceso a addReview sin sesión activa.');
        return res.redirect('/users/login');
    }


    try {
        const game = Game.getGameById(gameId);

        if (!game) {
            logger.error(`Juego con ID ${gameId} no encontrado para añadir review.`);
            return res.status(404).render('pages/error', {message: 'Juego no encontrado'});
        }
        // -------------------------------------------

        let contenido = 'pages/reviews/addReview';
        render(req, res, contenido, {
            errores: {},
            info: {},
            gameId: gameId,
            userId: userId,
            game: game
        });

    } catch (e) {
        logger.error(`Error al obtener datos para viewAddReview (Game ID: ${gameId}): ${e.message}`);
        // Renderizar una página de error genérica
        res.status(500).render('pages/error', {message: 'Error al cargar la página para añadir review.'});
    }
}


export function doAddReviewBD(req, res) {


    const gameId = req.body.gameId;
    const userId = req.body.userId;

    if (!gameId || !userId) {
        return res.redirect('/games/listajuegos');
    }

    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/reviews/addReview', {
            errores, info: {description: req.body.description, rating: req.body.rating},
            gameId, userId, game: Game.getGameById(gameId)
        })
    }

    const description = req.body.description.trim();
    const rating = req.body.rating.trim();
    const date = getCurrentUTCTime();


    try {
        const rev = new Review(gameId, userId, date, rating, description);


        Review.insert(rev);

        return res.redirect(`/games/${gameId}`);

    } catch (e) {
        logger.error('Error al insertar review');
        logger.debug('Excepcion al insertar review');

        let error = 'No se ha podido insertar la review';

        render(req, res, 'pages/reviews/addReview', {
            errores: {},
            exito: 'No se ha podido insertar la review',
            info: {description, rating},
            gameId, userId, game: Game.getGameById(gameId)
        });
    }


}

export function getCurrentUTCTime() {

    // padStart(x, y) adds y value to the left of the value x times
    const date = new Date();

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

