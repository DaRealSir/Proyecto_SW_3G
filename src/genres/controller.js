import express from 'express';
import {Genre} from "./Genre.js";
import {Game} from "../games/Game.js";
import { validationResult, matchedData } from 'express-validator';
export function deleteGenre(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errores: result.array() });
    }

    const genre_id = parseInt(req.params.id);
    const game_id = parseInt(req.params.gameId);

    const genre = Genre.getGenreById(genre_id);
    const game = Game.getGameById(game_id);

    const aux = Genre.getGenreGames(genre);
    const aux_length = aux.length;

    if (aux_length === 1) {
        Genre.delete(genre);
    } else {
        Genre.deleteGenreFromGame(game, genre);
    }

    res.redirect('/games/' + game_id);
}


export async function doAddGenreBD(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        const game_id = req.params.gameId;

        return render(req, res, 'pages/addGenrePage', {
            datos,
            errores,
            info: {
                genre_name: req.body.genre_name.trim(),
                game_id: game_id
            }
        });
    }

    const genre_name = req.body.genre_name.trim();
    const game_id = req.params.gameId;
    const genre = new Genre(null, genre_name);
    const game = Game.getGameById(game_id);

    Genre.addGenreToGame(game, genre);
    res.redirect('/games/' + game_id);
}