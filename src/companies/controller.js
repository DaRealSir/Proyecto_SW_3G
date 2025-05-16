import express from 'express';
import {Company} from "./Company.js";
import {Game} from "../games/Game.js";

export function deleteCompanyGame(req,res){
    let game_id = req.params.gameId;
    let company_id = req.params.id;
    let is_developer = req.body.is_developer === 'true';
    let is_publisher = req.body.is_publisher === 'true';
    let company = Company.getCompanyById(company_id);
    let game = Game.getGameById(game_id);
    if (is_developer) {
        Company.deleteCompanyFromGame(game, company, 'developer');
    }
    if(is_publisher){
        Company.deleteCompanyFromGame(game, company, 'publisher');
    }

    let aux1 = Company.getCompanyGames(company,'developer');
    let aux2 = Company.getCompanyGames(company,'publisher');
    if(aux1.length < 1 && aux2.length < 1){
        Company.delete(company);
    }
    res.redirect('/games/'+ game_id);
}

export function doAddCompanyBD(req, res){
    const company_name = req.body.company_name;
    const is_developer = req.body.is_developer;
    const is_publisher = req.body.is_publisher;

    const game_id = req.params.gameId;
    let company = new Company(null,company_name);
    let game = Game.getGameById(game_id);
    if(is_developer != undefined) Company.addCompanyToGame(game,company,'developer');
    if(is_publisher != undefined) Company.addCompanyToGame(game,company,'publisher');
    res.redirect('/games/'+ game_id);
}