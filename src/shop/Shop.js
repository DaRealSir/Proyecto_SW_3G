export class Shop {

    static #getShopInfoListByGameStmt = null;
    static #insertStmt = null;
    static #getListShopsInitFinalStmt= null;
    static #getSearchedListShopsAscStmt = null;
    static #getByIdStmt = null;
    static #getGamesByShopStmt = null;
    static #getAllShopsStmt = null;
     static #getShopByNameStmt = null;
     static #deleteShopByIdStmt = null;
     static #deleteGameShopByIdshopStmt = null;
    static #updateStmt = null;

    #id;
    name;
    image;

    constructor(name, image,  id = null) {
        this.#id = id;
        this.name = name;
        this.image = image;
    }

    
    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
    }

    get name() {
        return this.name;
    }

    set name(name) {
        this.name = name;
    }

    
    get image() {
        return this.image;
    }

    set image(image) {
        this.image = image;
    }

    
    static initStatements(db) {
        this.#insertStmt = db.prepare('INSERT INTO shop( name, image) VALUES ( @name, @image)');
        this.#getShopInfoListByGameStmt = db.prepare('SELECT DISTINCT * FROM shop JOIN game_shop ON game_shop.shop_id = shop.id WHERE game_id = @game_id');
        this.#getListShopsInitFinalStmt = db.prepare('SELECT * FROM shop LIMIT @number OFFSET @offset');
        this.#getSearchedListShopsAscStmt = db.prepare(`SELECT *
                                                FROM shop
                                                WHERE name LIKE @name
                                                 ORDER BY id ASC
                                                LIMIT @number OFFSET @offset`);
        this.#getByIdStmt = db.prepare('SELECT * FROM shop WHERE id = @id');
        this.#getGamesByShopStmt = db.prepare('SELECT DISTINCT * FROM game JOIN game_shop ON game_shop.game_id = game.id WHERE shop_id = @shop_id');
        this.#getAllShopsStmt = db.prepare('SELECT * FROM shop');
        this.#getShopByNameStmt = db.prepare('SELECT * FROM shop where name = @name');
        this.#deleteGameShopByIdshopStmt = db.prepare('DELETE FROM game_shop WHERE shop_id = @shop_id');
        this.#deleteShopByIdStmt = db.prepare('DELETE FROM shop WHERE id = @shop_id');
        this.#updateStmt = db.prepare('UPDATE shop SET name = @name, image = @image WHERE id = @id_shop');//TODO Hacer la inclusion para los genros de Game

    }

    static getAllShops(){
        const listShops = this.#getAllShopsStmt.all();
 

        return listShops;
    }
    
    static update(id_shop, shop) {
        const name = shop.name;
        const image = shop.image;

        const data = {name, image, id_shop};

        const result = this.#updateStmt.run(data);


        if (result.changes === 0) throw new GameNotFound(title);
        shop.#id = id_shop;

        return shop;
    }

    static insert(shop) {
        let result = null;
        try {
            const name = shop.name;
            const image = shop.image;


            const data = {
                name, image
            };


            result = this.#insertStmt.run(data);

            shop.#id = result.lastInsertRowid;
        } catch (e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new ShopExists(shop.name);
            }
            throw new ErrorDatos('No se ha insertado el Shop', {cause: e});
        }
        return shop;
    }

    static deleteById(id){
        const data = {
            shop_id: id
        }
        try {
        this.#deleteGameShopByIdshopStmt.run(data);
        console.log("HOOOOOOOOOOOLA");
        this.#deleteShopByIdStmt.run(data);
    } catch (e) {
        throw new ErrorDatos("Error al eliminar shop", { cause: e });
    }
    }

    static getShopById(id) {
        const shop = this.#getByIdStmt.get({id})
        if (shop === undefined) throw new ShopNotFound(id);

        return shop;
    }

    static getShopByName(name) {
        const shop = this.#getShopByNameStmt.get({name})
        if (shop === undefined) throw new ShopNotFound(name);

        return shop;
    }

    static getGamesByShop(id){
        const shop_id = id;
        const games_list = this.#getGamesByShopStmt.all({shop_id});

        return games_list;

    }

    static getShopListByGameId(game_id){
        const shop_list = this.#getShopInfoListByGameStmt.all({game_id});
        if (shop_list === undefined) {};

        return shop_list;

    }



    static getShopListLimited(number, offset) {
        const shopList = this.#getListShopsInitFinalStmt.all({number, offset});
        
        return shopList;
    }

    
        static getSearchedShopList(name, number, offset) {
    
            if (number === undefined) number = 20;
            if (offset === undefined) offset = 0;
    
            const searchedName = `%${name}%`;
            let shopList;
            shopList = this.#getSearchedListShopsAscStmt.all({name: searchedName, number, offset});

           

            if (shopList === undefined) throw new ShopNotFound(gameList);
    
            return shopList;
        }
}
export class ShopNotFound extends Error {
    /**
     *
     * @param {string} shop_n
     * @param {ErrorOptions} [options]
     */
    constructor(shop_n, options) {
        super(`Shop no encontrado: ${shop_n}`, options);
        this.name = 'ShopNoEncontrado';
    }
}


export class ShopExists extends Error {
    /**
     *
     * @param {string} title
     * @param {ErrorOptions} [options]
     */
    constructor(title, options) {
        super(`Shop already exists: ${title}`, options);
        this.name = 'ShopExists';
    }

}

