import express from 'express';
import { query, body } from 'express-validator';
import {checkTitle} from './controller.js';
import asyncHandler from 'express-async-handler';

const gamesApiRouter = express.Router();

gamesApiRouter.post('/available'
    , body('title', 'Title taken')
    , asyncHandler(checkTitle));
    
export default gamesApiRouter;