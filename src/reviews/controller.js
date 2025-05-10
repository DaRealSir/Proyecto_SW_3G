import express from "express";
import {Review} from "./Review.js";

const reviewRouter = express.Router();

// NO SE USAN ACTUALMENTE, SOLO SIRVEN PARA PAGINAS DEDICADAS A REVIEWS
// show reviews of a user
/*
export function showUserReviews(req, res) {
    let content = 'pages/reviews/userReviews';

    let uid = req.params.id;
    const reviewList = Review.getAllReviewsByUser(uid);

    res.render('page', {
        content,
        session: req.session,
        reviewList: reviewList
    });
}


// show reviews of a game
export function showGameReviews(req, res) {
    let content = 'pages/reviews/gameReviews';

    let gid = req.params.game_id;
    const reviewList = Review.getAllReviewsByGameId(id);


    res.render('page', {
        content,
        session: req.session,
        reviewList: reviewList
    });
}
*/
