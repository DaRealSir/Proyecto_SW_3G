import express from 'express';
import {Company} from "./Company.js";
import {Game} from "../games/Game.js";
import { validationResult, matchedData } from 'express-validator';
export function deleteCompanyGame(req, res) {
    let i = 1;
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({ errores: result.array() });
    }

    let game_id = parseInt(req.params.gameId);
    let company_id = parseInt(req.params.id);
    let is_developer = req.body.is_developer === 'true' || req.body.is_developer === true;
    let is_publisher = req.body.is_publisher === 'true' || req.body.is_publisher === true;
    let company = Company.getCompanyById(company_id);
    let game = Game.getGameById(game_id);

    if (is_developer) {
        Company.deleteCompanyFromGame(game, company, 'developer');
    }
    if (is_publisher) {
        Company.deleteCompanyFromGame(game, company, 'publisher');
    }

    res.redirect('/games/' + game_id);
}
export function doAddCompanyBD(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errores = result.array();
    const datos = req.body;
    const game_id = req.params.gameId;

    return res.status(400).render('pages/addCompanyPage', {
      datos,
      errores,
      info: {
        company_name: req.body.company_name,
        is_developer: req.body.is_developer,
        is_publisher: req.body.is_publisher,
        game_id
      }
    });
  }

  const company_name = req.body.company_name.trim();
  const is_developer = req.body.is_developer === 'true' || req.body.is_developer === true;
  const is_publisher = req.body.is_publisher === 'true' || req.body.is_publisher === true;
  const game_id = req.params.gameId;

  let company = new Company(null, company_name);
  let game = Game.getGameById(game_id);

  if (is_developer) {
    Company.addCompanyToGame(game, company, 'developer');
  }
  if (is_publisher) {
    Company.addCompanyToGame(game, company, 'publisher');
  }

  res.redirect('/games/' + game_id);
}