import express from 'express';
import { body } from 'express-validator';
import asyncHandler from 'express-async-handler';
import {
    doAddCompanyBD,
    deleteCompanyGame,
} from './controller.js';

const companyRouter = express.Router();

companyRouter.post('/addCompany/:gameId',
    body('company_name', 'No puede ser vacío').notEmpty(),
    body('is_publisher', 'No puede ser vacío').notEmpty(),
    body('is_developer', 'No puede ser vacío').notEmpty(),
    asyncHandler(doAddCompanyBD)
);

companyRouter.post('/deleteCompany/:id/:gameId',
    body('company_name', 'No puede ser vacío').notEmpty(),
    body('is_publisher', 'No puede ser vacío').notEmpty(),
    body('is_developer', 'No puede ser vacío').notEmpty(),
    asyncHandler(deleteCompanyGame)
);

export default companyRouter;
