import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import express from 'express';

import {
    doAddGuide,
    viewAddGuide
} from './controller.js';

const guidesRouter = express.Router();

guidesRouter.post('/addGuide/:game_id', doAddGuide); //TODO: hacer comprobacion de inputs
guidesRouter.get('/addGuide/:game_id', viewAddGuide);


export default guidesRouter;