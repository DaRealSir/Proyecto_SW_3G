import express from 'express';

import { addFav,deleteFav } from './controller.js';

const favRouter=express.Router();

favRouter.post('/delete/:game',deleteFav);
favRouter.post('/add/:game',addFav);

export default favRouter