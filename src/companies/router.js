import express from 'express';
import { body } from 'express-validator';
import asyncHandler from 'express-async-handler';
import {
    deleteGenre,
    doAddCompanyBD,
    doModifyGenreBD,
    showGameGenres,
} from './controller.js';

const companyRouter = express.Router();

companyRouter.post('/addCompany/:gameId',
    body('company_name', 'No puede ser vacío').notEmpty(),
    asyncHandler(doAddCompanyBD)
);
companyRouter.get('/showGenres/:gameId', showGameGenres);
companyRouter.post('/modifyGenre/:gameId/:newName', doModifyGenreBD);
companyRouter.post('/deleteGenre/:id/:gameId', deleteGenre);


export default companyRouter;
