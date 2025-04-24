//import bcrypt from "bcryptjs";
const validColumns = ['title', 'favNumber', 'rating'];
const validDirections = ['ASC', 'DESC'];


export class Game {
    static #getByTitleStmt = null;
    static #getbyCompanyStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #getAllGamesStmt = null;
    static #getListGamesInitFinalStmt = null
    static #getSearchedListGamesAscStmt = null;
    static #getSearchedListGamesDescStmt = null;
    static #getSearchedListGamesByGenreAscStmt = null;
    static #getSearchedListGamesByGenreDescStmt = null;
    static #getByIdStmt = null;
    static result;
    static #deleteByID = null;
    #id;
    title;
    description;
    rating;
    favNumber;
    image;
    company;

    constructor(title, description, rating, favNumber, image, company, id = null) {
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.favNumber = favNumber;
        this.image = image;
        this.company = company;
        this.#id = id;
    }
    get id() {
        return this.#id;
    }

    get title() {
        return this.title;
    }

    set title(title) {
        this.title = title;
    }

    get description() {
        return this.description;
    }

    set description(description) {
        this.description = description;
    }

    get rating() {
        return this.rating;
    }

    set rating(rating) {
        this.ti = rating;
    }

    get favNumber() {
        return this.favNumber;
    }

    set favNumber(favNumber) {
        this.favNumber = favNumber;
    }

    get image() {
        return this.image;
    }

    set image(image) {
        this.image = image//TODO No se como funciona esto
    }

    get company() {
        return this.company;
    }

    set company(company) {
        this.company = company;
    }

    static initStatements(db) {
        if (this.#getByTitleStmt !== null) return;
        if (this.#getbyCompanyStmt !== null) return;
        this.#getByTitleStmt = db.prepare('SELECT * FROM game WHERE title = @title');

        this.#getbyCompanyStmt = db.prepare('SELECT * FROM game WHERE company_id=@company');

        this.#insertStmt = db.prepare('INSERT INTO game( title, description, rating, favNumber,image, company_id) VALUES ( @title, @description, @rating, @favNumber,@image, @company)');

        this.#updateStmt = db.prepare('UPDATE game SET title = @title, description = @description, rating = @rating, favNumber = @favNumber,image=@image, company_id = @company WHERE id = @id_game');//TODO Hacer la inclusion para los genros de Game

        this.#getAllGamesStmt = db.prepare('SELECT * FROM game');

        this.#getByIdStmt = db.prepare('SELECT * FROM game WHERE id = @id');
        this.#getListGamesInitFinalStmt = db.prepare('SELECT * FROM game LIMIT @number OFFSET @offset');
        this.#getSearchedListGamesAscStmt = db.prepare(`SELECT *
                                                        FROM game
                                                        WHERE title LIKE @title
                                                        ORDER BY CASE
                                                                     WHEN @orderBy = 'title' THEN title
                                                                     WHEN @orderBy = 'favNumber' THEN favNumber
                                                                     WHEN @orderBy = 'rating' THEN rating
                                                                     ELSE id
                                                                     END
                                                                ASC
                                                        LIMIT @number OFFSET @offset`);
        this.#getSearchedListGamesByGenreAscStmt = db.prepare(`SELECT game.*
                                                            FROM game
                                                            JOIN game_genre ON game.id = game_genre.game_id
                                                            JOIN genre ON genre.id = game_genre.genre_id
                                                            WHERE title LIKE @title
                                                             AND genre.id = @genreId
                                                            ORDER BY CASE
                                                                         WHEN @orderBy = 'title' THEN title
                                                                         WHEN @orderBy = 'favNumber' THEN favNumber
                                                                         WHEN @orderBy = 'rating' THEN rating
                                                                         ELSE game.id
                                                                         END
                                                                    ASC
                                                            LIMIT @number OFFSET @offset`);
        this.#getSearchedListGamesDescStmt = db.prepare(`SELECT *
                                                         FROM game
                                                         WHERE title LIKE @title
                                                         ORDER BY CASE
                                                                      WHEN @orderBy = 'title' THEN title
                                                                      WHEN @orderBy = 'favNumber' THEN favNumber
                                                                      WHEN @orderBy = 'rating' THEN rating
                                                                      ELSE id
                                                                      END
                                                                 DESC
                                                         LIMIT @number OFFSET @offset`);
        this.#getSearchedListGamesByGenreDescStmt = db.prepare(`SELECT game.*
                                                            FROM game
                                                            JOIN game_genre ON game.id = game_genre.game_id
                                                            JOIN genre ON genre.id = game_genre.genre_id
                                                            WHERE title LIKE @title
                                                             AND genre.id = @genreId
                                                            ORDER BY CASE
                                                                         WHEN @orderBy = 'title' THEN title
                                                                         WHEN @orderBy = 'favNumber' THEN favNumber
                                                                         WHEN @orderBy = 'rating' THEN rating
                                                                         ELSE game.id
                                                                         END
                                                                    DESC
                                                            LIMIT @number OFFSET @offset`);
   

        this.#deleteByID = db.prepare('DELETE FROM game WHERE id = @id');
    }

    static getGameByTitle(title) {
        const game = this.#getByTitleStmt.get({title});
        if (game === undefined) throw new GameNotFound(title);

        const {description, rating, favNumber, image, company_id, id} = game;

        return new Game(title, description, rating, favNumber, image, company_id, id);
    }

    static getGameById(id) {
        const juego = this.#getByIdStmt.get({id})
        if (juego === undefined) throw new GameNotFound(id);

        //const {  descripcion, valoracion, numFavoritos, titulo } = juego;

        const {title, description, rating, favNumber, image, company_id} = juego;


        return new Game(title, description, rating, favNumber, image, company_id, id);
    }

    static getGameList() {
        const gameList = this.#getAllGamesStmt.all();
        if (gameList === undefined) throw new GameNotFound(gameList);

        return gameList;
    }

    static getSearchedGameList(title, order, order_dir, number, offset, genreId) {

        if (number === undefined) number = 20;
        if (offset === undefined) offset = 0;

        const searchedTitle = `%${title}%`;
        let gameList;
        if (genreId === undefined || genreId === 0){
            if (order_dir === "ASC")
                gameList = this.#getSearchedListGamesAscStmt.all({title: searchedTitle, orderBy: order, number, offset});
            else
                gameList = this.#getSearchedListGamesDescStmt.all({title: searchedTitle, orderBy: order, number, offset});
        }
        else{
            if (order_dir === "ASC")
                gameList = this.#getSearchedListGamesByGenreAscStmt.all({title: searchedTitle, orderBy: order, number, offset, genreId});
            else
                gameList = this.#getSearchedListGamesByGenreDescStmt.all({title: searchedTitle, orderBy: order, number, offset, genreId});
        }
        //   const gameList = this.#getSearchedListGamesStmt.all({title: searchedTitle, orderBy: order, orderDirection: orderDirection, number, offset});
        if (gameList === undefined) throw new GameNotFound(gameList);

        return gameList;
    }

    static getGameListLimited(number, offset) {
        const gameList = this.#getListGamesInitFinalStmt.all({number, offset});
        if (gameList === undefined) throw new GameNotFound(gameList);

        return gameList;
    }

    static insert(game) {
        return Game.#insert(game);
    }

    static #insert(game) {
        let result = null;
        try {
            const title = game.title;
            const description = game.description;
            const rating = game.rating;
            const favNumber = game.favNumber;
            const image = game.image;
            const company = game.company;


            const data = {
                title, description, rating, favNumber, image,
                company
            };


            result = this.#insertStmt.run(data);

            game.#id = result.lastInsertRowid;
        } catch (e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new GameExists(game.title);
            }
            throw new ErrorDatos('No se ha insertado el Game', {cause: e});
        }
        return game;
    }
/*
    static delete(title) {
        const resul = this.#deleteByID(title);
        if (resul.changes === 0) throw new GameNotFound(title);

    }
*/
    static deleteById(id) {
        const data = {id};
        const resul = this.#deleteByID.run(data);
        if (resul.changes === 0) throw new GameNotFound(id);
    }


    static update(id_game, game) {
        const title = game.title;
        const description = game.description;
        const rating = game.rating;
        const favNumber = game.favNumber;
        const image = game.image;
        const company = game.company;

        const data = {title, description, rating, favNumber, image, company, id_game};

        const result = this.#updateStmt.run(data);


        if (result.changes === 0) throw new GameNotFound(title);
        game.#id = id_game;

        return game;
    }

    static #update(game) {
        const title = game.title;
        const description = game.description;
        const rating = game.rating;
        const favNumber = game.favNumber;
        const image = game.image;

        const datos = {title, description, rating, favNumber, image};

        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new GameNotFound(title);

        return game;
    }


    persist() {
        if (this.#id === null) return Game.#insert(this);
        return Game.#update(this);
    }
}

export class GameNotFound extends Error {
    /**
     *
     * @param {string} title
     * @param {ErrorOptions} [options]
     */
    constructor(title, options) {
        super(`Game no encontrado: ${title}`, options);
        this.name = 'GameNoEncontrado';
    }
}


export class GameExists extends Error {
    /**
     *
     * @param {string} title
     * @param {ErrorOptions} [options]
     */
    constructor(title, options) {
        super(`Game already exists: ${title}`, options);
        this.name = 'GameExists';
    }
}
