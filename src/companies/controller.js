import express from 'express';
import {Company} from "./Company.js";
import {Game} from "../games/Game.js";

export function deleteCompany(req,res){
    let company_id = req.params.id;
    let game_id = req.params.gameId;
    let company = Company.getCompanyById(genre_id);
    let game = Game.getGameById(game_id);
    let aux = Company.getCompanyGames(company);
    let aux_length = aux.length;
    if(aux_length == 1){
        Company.delete(genre);
    }
    else Company.deleteCompanyFromGame(game,genre);
    res.redirect('/games/'+ game_id);
}
export function showGameCompanies(req,res){

    const gameId = req.params.gameId;
    const game = Game.getGameById(gameId);
    const editorCompany = Company.getGameCompany(game,"editor");
    const publisherCompany = Company.getGameCompanies(game,"publisher");
    res.render(req,res,'pages/showGameCompanies',{
        contenido,
        session: req.session,
        editorCompany: editorCompany,
        publisherCompany: publisherCompany
    }
    )
}
export function doAddCompanyBD(req, res){
    const company_name = req.body.genre_name;
    const game_id = req.params.gameId;
    let company = new Company(null,genre_name);
    let game = Game.getGameById(game_id);
    Company.addGenreToGame(game,company);
    res.redirect('/games/'+ game_id);
}