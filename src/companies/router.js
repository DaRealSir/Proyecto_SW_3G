import express from 'express';
import { body, param } from 'express-validator';
import asyncHandler from 'express-async-handler';
import {
    doAddCompanyBD,
    deleteCompanyGame,
} from './controller.js';

const companyRouter = express.Router();

companyRouter.post('/addCompany/:gameId',
    param('gameId', 'ID del juego debe ser un entero mayor que 0').isInt({ min: 1 }),
    body('is_publisher', 'No puede ser vacío').notEmpty(),
    body('is_developer', 'No puede ser vacío').notEmpty(),
    asyncHandler(doAddCompanyBD)
);

companyRouter.post('/deleteCompany/:id/:gameId',
    param('gameId', 'ID del juego debe ser un entero mayor que 0').isInt({ min: 1 }),
    param('id', 'ID de la compañia debe ser un entero mayor que 0').isInt({ min: 1 }), 
    body('is_publisher', 'No puede ser vacío').notEmpty(),
    body('is_developer', 'No puede ser vacío').notEmpty(),
    asyncHandler(deleteCompanyGame)
);

export default companyRouter;
