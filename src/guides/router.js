import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import express from 'express';

import {
    doAddGuide,
    listGuidesByGameId,
    viewAddGuide,
    showFullGuide
} from './controller.js';

const guidesRouter = express.Router();

guidesRouter.post('/addGuide/:game_id',
    body('title', 'No puede ser vacio').trim().notEmpty(),
    body('content', 'No puede ser vacio').trim().notEmpty(),
    asyncHandler(doAddGuide));
guidesRouter.get('/addGuide/:game_id', viewAddGuide);
guidesRouter.get('/games/:game_id/guides', listGuidesByGameId);
guidesRouter.get('/:guide_id', showFullGuide);


export default guidesRouter;