import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import express from 'express';

import { autenticado } from '../middleware/auth.js';
import {
    viewAddShop,
    doAddShopBD,
    showShopList,
    showShopListSearched,
    showShopInfo,
    doDeleteShop,
    viewModifyShop,
    doModifyShop
} from "./controller.js";


const shopRouter = express.Router();

shopRouter.get('/addShop', viewAddShop);
shopRouter.post('/addShop', 
    body('name', 'No puede ser vacío').trim().notEmpty(), 
    body('image', 'No puede ser vacío').trim().notEmpty(), 
    asyncHandler(doAddShopBD));

shopRouter.get('/shopList', showShopList);
shopRouter.post('/shopList', showShopListSearched);
shopRouter.get('/shopList/page/:numPage', showShopList);
shopRouter.post('/shopList/page/:numPage', showShopListSearched);
shopRouter.get('/:id', showShopInfo);

shopRouter.post('/deleteShop/:id', doDeleteShop);

shopRouter.get('/modifyShop/:id',viewModifyShop);
shopRouter.post('/modifyShop/:id', 
    body('name', 'No puede ser vacío').trim().notEmpty(), 
    body('image', 'No puede ser vacío').trim().notEmpty(), 
    asyncHandler(doModifyShop));


export default shopRouter; 