export class UserGame {
    static #getbyUserStmt = null;
    static #getbyGameIDStmt = null;
    static #getbyBothStmt = null;
    static #addNewFavStmt = null;
    static #deleteStmt = null;

    #idUser;
    #idGame;

    constructor(idUser, idGame) {
        this.#idUser = idUser;
        this.#idGame = idGame;
    }

    get idUser() {
        return this.#idUser;
    }

    set idUser(id) {
        this.#idUser = id;
    }

    get idGame() {
        return this.#idGame;
    }

    set idGame(id) {
        this.#idGame = id;
    }

    static initStatements(db) {
        this.#getbyGameIDStmt = db.prepare('SELECT * FROM user_game WHERE game_id = @game_id');
        this.#getbyUserStmt = db.prepare('SELECT g.* FROM game g JOIN user_game ug ON g.id = ug.game_id WHERE ug.user_id = @user_id;');
        this.#getbyBothStmt = db.prepare('SELECT * FROM user_game WHERE user_id = @user_id AND game_id = @game_id');
        this.#addNewFavStmt = db.prepare('INSERT INTO user_game(user_id, game_id) VALUES (@user_id, @game_id)');
        this.#deleteStmt = db.prepare('DELETE FROM user_game WHERE user_id = @user_id AND game_id = @game_id');
    }

    static getbyUserID(user_id) {
        return this.#getbyUserStmt.all({ user_id });
    }

    static getbyGameID(game_id) {
        return this.#getbyGameIDStmt.all({ game_id });
    }

    static getPrecise(user_id, game_id) {
        const data = { user_id, game_id };
        return this.#getbyBothStmt.get(data);  // usamos .get para un SELECT que devuelve una fila
    }

    static newUserGame(user_id, game_id) {
        const data = { user_id, game_id };
        const exists = this.#getbyBothStmt.get(data);
        if (exists){return;}
        this.#addNewFavStmt.run(data);
    }

    static deleteUserGame(user_id, game_id) {
        const data = { user_id, game_id };
        const exists = this.#getbyBothStmt.get(data);
        if (!exists) {return;}
        this.#deleteStmt.run(data);
    }
}
