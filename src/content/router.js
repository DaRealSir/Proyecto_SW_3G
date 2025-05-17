import express from 'express';
import {viewContenidoAdmin, viewContenidoJournal, viewContenidoNormal, viewLibrary} from './controller.js';

const contentRouter = express.Router();

contentRouter.get('/normal', viewContenidoNormal);
contentRouter.get('/admin', viewContenidoAdmin);
contentRouter.get('/journal', viewContenidoJournal);
contentRouter.get('/library',viewLibrary);

export default contentRouter;