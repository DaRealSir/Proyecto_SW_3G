import express from 'express';
import { query, body } from 'express-validator';
import {checktTitle} from './controller.js';
import asyncHandler from 'express-async-handler';

const usuariosApiRouter = express.Router();

usuariosApiRouter.post('/disponible'
    , body('title', 'Title taken')
    , asyncHandler(checktTitle));
    
export default gamesApiRouter;