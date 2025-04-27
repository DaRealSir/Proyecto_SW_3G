import express from 'express';
import {Game} from "./Game.js";
import {Review} from "../reviews/Review.js";
import {Genre} from "../genres/Genre.js"

import { render } from '../utils/render.js';
import { validationResult, matchedData } from 'express-validator';

import {User} from "../users/User.js";

import {logger} from '../logger.js'; 
import { Forum } from '../forum/Forum.js';
const juegosRouter = express.Router();


export function showGameList(req, res) {

    let page = 1;
    if (req.params.numPage ){
        page = parseInt(req.params.numPage, 10); 
    }

    // 4 para pruebas,  16 de normal
    let numGamesPerPage = 4;

    const gameList = Game.getSearchedGameList("", "title", "DESC", numGamesPerPage, (page - 1) *numGamesPerPage);
    const genres = Genre.getListGenres();
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
    if (req.params.numPage ){
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
    if (genre_option === undefined || genre_option === "Cualquiera"){
         gameList = Game.getSearchedGameList(title, order, order_dir, numGamesPerPage, (page - 1) *numGamesPerPage, 0);
    }
    else{
        const genre = Genre.getGenreByName(genre_option)
        const genre_id = genre.id;
         gameList = Game.getSearchedGameList(title, order, order_dir, numGamesPerPage, (page - 1) *numGamesPerPage, genre_id);
    }

    const genres = Genre.getListGenres();
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
    const genres = Genre.getGameGenres(game);
    const threadList = Forum.getThreadsByGame(id);
    render(req, res, contenido, {
        game: game,
        reviewList: reviewListByGameId,
        genreList: genres,
        threadList: threadList
    });

}

export function viewAddGameBD(req, res) {

    let contenido = 'pages/addGamePage';

    render(req, res, contenido, {
        errores: {},
        info: {}
    });
}


export function doAddGameBD(req, res) {
    const result = validationResult(req);

    const title = req.body.title.trim();
    const description = req.body.description.trim();
    const rating = Number(req.body.rating.trim());
    const favNumber = parseInt(req.body.favNumber.trim());
    const company_id = parseInt(req.body.company_id.trim());
    const url_image =  req.body.url_image.trim();
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/addGamePage', {
            datos,
            errores,
            info:{
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

        render(req, res, 'pages/addGamePage', {
            errores: {},
            exito: 'Juego insertado con exito en la Base de Datos',
            info:{
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image,
                company_id: company_id
            }
        });


    } catch (e) {
       

       logger.error(e);
        logger.error(`Error al hacer inserción de juego ${title}`);
        logger.debug(`Excepcion al hacer inserción de juego ${title}`);

        let error = 'No se ha podido insertar juego';

        render(req, res, 'pages/addGamePage', {
            error,
            datos: {},
            errores: {},
            info:{
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
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/modifyGamePage', {
            datos,
            errores, 
            info:{
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image,
                company_id: company_id,
                url_image: url_image
            },
            game:{
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


        render(req, res, 'pages/game', {
            errores: {},
            exito: 'Juego modificado con exito en la Base de Datos',
            game: game2,
            reviewList: reviewListByGameId,
            genreList: genres,
            threadList: threadList
        });

    
    } catch (e) {
        
        //const reviewListByGameId = Review.getAllReviewsByGameId(gameId);
        //const genres = Genre.getGameGenres(game);
        //const threadList = Forum.getThreadsByGame(gameId);

        render(req, res, 'pages/modifyGamePage', {
            errores: {},
            error: 'ERROR al modificar juego en la Base de Datos',
            info:{
                id: gameId,
                title: title,
                description: description,
                rating: rating,
                favNumber: favNumber,
                url_image: url_image, 
                company_id: company_id,
            },
            game:{
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
    const gameId = req.body.gameId;
    const user= User.getUserByUsername(req.params.session.UserName);
    const userId = user.id;

    if(!gameId || !userId){
        console.log("gameId or userId not sent");
        return res.redirect('/games/listajuegos');
    }

    console.log(gameId);
    console.log(userId);

    console.log("ANTES DE ELIMINAR");

    Review.deleteReview(id);

    console.log("DESPUES DE ELIMINAR");

    showGameInfo(req, res);
}

export function viewAddReview(req, res) {
    let contenido = 'pages/reviews/addReview';
    render(req, res, contenido, {
        errores: {},
        info: {}
    })
}



export function doAddReviewBD(req, res) {
    console.log("DOADDREVIEWBD INICIO");
    console.log(req.body.gameId);
    console.log(req.body.UserName);

    const gameId = req.body.gameId;
    const userId = User.getUserByUsername(req.body.userName).id;

    console.log("DOADDREVIEWBD SEGUNDO");
    console.log(gameId);
    console.log(userId);


    if(!gameId || !userId){
        console.log("gameId or userId not sent");
        return res.redirect('/games/listajuegos');
    }

    const result = validationResult(req);
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/addReviewPage', {
            datos,
            errores
        })
    }

    const description = req.body.description.trim();
    const rating = req.body.rating.trim();
    const date = getCurrentUTCTime();


    try{
        const rev = new Review(gameId, userId, date, rating, description);

        Review.insert(rev);

        render(req, res, contenido, {
            errores: {},
            exito: 'Review insertado con exito',
            info:{
                description: description,
                rating: rating,
            }
        });
    } catch (e) {
        logger.error('Error al insertar review');
        logger.debug('Excepcion al insertar review');

        let error = 'No se ha podido insertar la review';

        render(req, res, 'pages/addReviewPage', {
            error,
            datos: {},
            errores: {},
            info:{
                description: description,
                rating: rating,
            }
        });
    }


}

function getCurrentUTCTime() {

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
