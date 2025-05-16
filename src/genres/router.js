import express from 'express';
import { body , param} from 'express-validator';
import asyncHandler from 'express-async-handler';
import {
    deleteGenre,
    doAddGenreBD,
} from './controller.js';

const genreRouter = express.Router();

genreRouter.post('/addGenre/:gameId',
    param('gameId', 'ID del juego debe ser un entero mayor que 0').isInt({ min: 1 }),
    body('genre_name', 'No puede ser vacío').notEmpty(),
    asyncHandler(doAddGenreBD)
);

genreRouter.post('/deleteGenre/:id/:gameId',
    param('gameId', 'ID del juego debe ser un entero mayor que 0').isInt({ min: 1 }),
    param('id', 'ID del genero debe ser un entero mayor que 0').isInt({ min: 1 }), 
    asyncHandler(deleteGenre)
);


export default genreRouter;
