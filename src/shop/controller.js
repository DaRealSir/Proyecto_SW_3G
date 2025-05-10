import express from 'express';
import {Shop} from "./Shop.js"


import {render} from '../utils/render.js';
import {matchedData, validationResult} from 'express-validator';

import {logger} from '../logger.js';


const shopRouter = express.Router();


export function showShopList(req, res) {

    let page = 1;
    if (req.params.numPage) {
        page = parseInt(req.params.numPage, 10);
    }

    // 4 para pruebas,  16 de normal
    let numShopsPerPage = 4;

    const shopList = Shop.getSearchedShopList("", numShopsPerPage, (page - 1) *numShopsPerPage);
    render(req, res, 'pages/shopList', {
        errores: {},
        info: {},
        shopList: shopList,
        page,
        filtersValues: {},
    });
}


export function showShopInfo(req, res) {

    let contenido = 'pages/shop';

    let id = req.params.id;

    const shop = Shop.getShopById(id);
    const gameList = Shop.getGamesByShop(id);
    render(req, res, contenido, {
        shop: shop,
        gameList: gameList
    });

}

export function showShopListSearched(req, res) {

}

export function doDeleteShop(req, res) {
    const id = req.params.id;

    try {
        Shop.deleteById(id);

        return showShopList(req, res);
    } catch (e) {

        return showShopList(req, res);
    }

}


export function viewAddShop(req, res) {

    let contenido = 'pages/addShopPage';
    render(req, res, contenido, {
        errores: {},
        info: {}
    });
}

export function doAddShopBD(req, res) {
    const result = validationResult(req);

    const name = req.body.name.trim();
    const image = req.body.image.trim();
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/addShopPage', {
            datos,
            errores,
            error: "Datos incorrectos",
            info: {
                name: name,
                image: image
            }
        });
    }


    try {
        
        console.log("HOOOOOOOOOOOOOOOLA");
        
        console.log(name);
        console.log(image);
        const shop = new Shop(name, image, null);

        console.log("HOOOOOOOOOOOOOOOLA");
        console.log("Shop", shop);
        const shop2 = Shop.insert(shop);

        render(req, res, 'pages/addShopPage', {
            errores: {},
            exito: 'Shop insertado con exito en la Base de Datos',
            info: {
                name: name,
                image: image
            }
        });


    } catch (e) {


        logger.error(e);
        logger.error(`Error al hacer inserción de shop ${name}`);
        logger.debug(`Excepcion al hacer inserción de shop ${name}`);

        let error = 'No se ha podido insertar la tienda';

        render(req, res, 'pages/addShopPage', {
            error,
            datos: {},
            errores: {},
            info: {
                name: name,
                image: image
            }
        });
    }
}


export function viewModifyShop(req, res) {

    const shopId = req.params.id;
    const shop = Shop.getShopById(shopId);

    let contenido = 'pages/modifyShop';

    render(req, res, contenido, {
        errores: {},
        info: {
            name: shop.name,
            image: shop.image,
        },
        shop
    });
}


export function doModifyShop(req, res) {

        console.log("HOOOOOOOOOOOOOOOOOLA");
    const shop_id = req.params.id;
    const name = req.body.name.trim();
    const image = req.body.image.trim();

    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'pages/modifyShop', {
            datos,
            errores,
            info: {
                name: name,
                image: image
            },
            shop: {
                id: shop_id
            }
        });
    }

    try {
        
        console.log("HOOOOOOOOOOOOOOOOOLA");
        const new_info_shop = new Shop(name, image, null);

        console.log("HOOOOOOOOOOOOOOOOOLA");
        const shop2 = Shop.update(shop_id, new_info_shop);


        const gameList = Shop.getGamesByShop(shop_id);
        render(req, res, 'pages/shop', {
            errores: {},
            exito: 'Juego modificado con exito en la Base de Datos',
            shop: shop2,
            gameList: gameList
        });


    } catch (e) {

        render(req, res, 'pages/modifyShop', {
            errores: {},
            error: 'ERROR al modificar tienda en la Base de Datos',
             info: {
                name: name,
                image: image
            },
            shop: {
                id: shop_id
            }
        });
    }
}