import express from 'express';
import {Genre} from "./Genre.js";
import {Game} from "../games/Game.js";

export function deleteGenre(req,res){
    let genre_id = req.params.id;
    let game_id = req.params.gameId;
    let genre = Genre.getGenreById(genre_id);
    let game = Game.getGameById(game_id);
    let aux = Genre.getGenreGames(genre);
    let aux_length = aux.length;
    if(aux_length == 1){
        console.log(aux);
        console.log(aux.lenght);
        Genre.delete(genre);
    }
    else Genre.deleteGenreFromGame(game,genre);
    res.redirect('/games/'+ game_id);
}
export function showGameGenres(req,res){

    const gameId = req.params.gameId;
    const game = Game.getGameGenres(gameId);
    const genreList = Genre.getGameGenres(game);
    res.render(req,res,'pages/showGameGenres',{
        contenido,
        session: req.session,
        genreList: genreList
    }
    )
}
export function doModifyGenreBD(req,res){
//WIP
}

export function doAddGenreBD(req, res){
    const genre_name = req.body.genre_name;
    const game_id = req.params.gameId;
    let genre = new Genre(null,genre_name);
    let game = Game.getGameById(game_id);
    Genre.addGenreToGame(game,genre);
    res.redirect('/games/'+ game_id);
}