export class Shop {

    static #getShopListByGameStmt = null;

    #id;
    name;
    image;

    constructor(id, name, image) {
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
       
        this.#getShopListByGameStmt = db.prepare('SELECT DISTINCT shop.* FROM game JOIN game_shop ON game_shop.game_id = @game_id JOIN shop ON game_shop.shop_id = shop.id');
    }

    static getShopListByGameId(game_id){
        const shop_list = this.#getShopListByGameStmt.all({game_id});
        if (shop_list === undefined) {};

        return shop_list;

    }
}