import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import express from 'express';

import {
    doAddGuide,
    listGuidesByGameId,
    viewAddGuide,
    showFullGuide,
    doEditGuide,
} from './controller.js';

const guidesRouter = express.Router();

guidesRouter.post('/addGuide/:game_id',
    body('title', 'No puede ser vacio').trim().notEmpty(),
    body('content', 'No puede ser vacio').trim().notEmpty(),
    body('guide_type', 'Tipo de guía inválido').isIn(['G', 'N']),
    asyncHandler(doAddGuide));
guidesRouter.get('/addGuide/:game_id', viewAddGuide);
guidesRouter.get('/games/:game_id/guides', listGuidesByGameId);
guidesRouter.get('/:guide_id', showFullGuide);
guidesRouter.post('/edit/:guide_id',
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    asyncHandler(doEditGuide)
);
export default guidesRouter;