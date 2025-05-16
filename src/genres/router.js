import express from 'express';
import { body } from 'express-validator';
import asyncHandler from 'express-async-handler';
import {
    deleteGenre,
    doAddGenreBD,
    showGameGenres,
} from './controller.js';

const genreRouter = express.Router();

genreRouter.post('/addGenre/:gameId',
    body('genre_name', 'No puede ser vacío').notEmpty(),
    asyncHandler(doAddGenreBD,)
);
genreRouter.get('/showGenres/:gameId', showGameGenres);
genreRouter.post('/deleteGenre/:id/:gameId', deleteGenre);


export default genreRouter;
