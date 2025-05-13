import review from "ejs/ejs.js";
import {ErrorDatos} from "../db.js";

export class Review {
    static #getByTextStmt = null;
    static #getAllReviewsByUserStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #getAllReviewsStmt = null;
    static #getAllReviewsByGameIdStmt = null;
    static #getByIdStmt = null;
    static #deleteReviewByIdStmt = null;
    #id;
    game_id;
    user_id;
    rating;
    description; // review text
    date;

    constructor(game_id, user_id, date, rating, description) {
        this._game_id = game_id;
        this.game_id = game_id;

        this._user_id = user_id;
        this.user_id = user_id;

        this._date = date;
        this.date = date;

        this._rating = rating;
        this.rating = rating;

        this._description = description;
        this.description = description;
    }

    get game_id() {
        return this._game_id;
    }

    set game_id(value) {
        this._game_id = value;
    }

    get user_id() {
        return this._user_id;
    }

    set user_id(value) {
        this._user_id = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get rating() {
        return this._rating;
    }

    set rating(value) {
        this._rating = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    static initStatements(db) {
        this.#getByTextStmt = db.prepare(
            "SELECT * FROM review WHERE description = @text"
        );
        this.#getAllReviewsByUserStmt = db.prepare(
            "SELECT * FROM review WHERE user_id = @userid"
        );
        this.#getAllReviewsByGameIdStmt = db.prepare(
            `SELECT review.id AS reviewId,
                    user.username,
                    user.profile_picture,
                    user.id AS userId,
                    game.id AS gameId,
                    review.description,
                    review.rating,
                    review.date
             FROM review
                      JOIN game on review.game_id = game.id
                      JOIN user on review.user_id = user.id
             WHERE game_id = @gameId`
        );
        this.#insertStmt = db.prepare(
            "INSERT INTO review(user_id, game_id, description, rating, date) VALUES (@user_id, @game_id, @description, @rating, @date)"
        );
        this.#updateStmt = db.prepare(
            "UPDATE review SET user_id = @user_id, game_id = @game_id, description = @description, rating = @rating, date = @date"
        );
        this.#getAllReviewsStmt = db.prepare("SELECT * FROM review");
        this.#getByIdStmt = db.prepare("SELECT * FROM review WHERE id = @id");
        this.#deleteReviewByIdStmt = db.prepare('DELETE FROM review WHERE id = @id');
    }

    static getReviewById(id) {
        const review = this.#getByIdStmt.get({id});
        if (review === undefined) throw new ReviewNotFound(id);
        const {game_id, user_id, date, rating, description} = review;

        return new Review(game_id, user_id, date, rating, description);
    }

    static getReviewByText(text) {
        const review = this.#getByTextStmt.get({text});
        if (review === undefined) throw new ReviewNotFound(text);
        const {game_id, user_id, date, rating, description} = review;

        return new Review(game_id, user_id, date, rating, description);
    }

    static getAllReviewsByGameId(gameId) {

        const review = this.#getAllReviewsByGameIdStmt.all({gameId});
        if (review === undefined) throw new ReviewNotFound(gameId);

        return review;
    }

    static getAllReviewsByUser(userid) {
        const reviewlist = this.#getAllReviewsByUserStmt.all({userid});
        if (review === undefined) throw new ReviewNotFound(userid);

        return reviewlist;
    }

    static getAllReviews() {
        const reviewlist = this.#getAllReviewsStmt.all();
        if (reviewlist === undefined) throw new ReviewNotFound();

        return reviewlist;
    }

    static deleteReview(id) {
        const res = this.#deleteReviewByIdStmt.run({id});
        if (res.changes === 0) throw new ReviewNotFound(id);
    }

    static insert(review) {
        Review.#insert(review);
    }

    static #insert(review) {
        let result = null;

        try {
            const game_id = review.game_id;
            const user_id = review.user_id;
            const date = review.date;
            const rating = review.rating;
            const description = review.description;

            const data = {
                game_id: game_id,
                user_id: user_id,
                date: date,
                rating: rating,
                description: description,
            };

            result = this.#insertStmt.run(data);
            review.#id = result.lastInsertdRowid;
        } catch (e) {
            if (e.code === "SQLITE_CONSTRAINT") {
                throw new ReviewExists(review.id);
            }
            throw new ErrorDatos("No se ha insertado el Review", {cause: e});
        }
        return review;
    }

    static #update(review) {
        const game_id = review.game_id;
        const user_id = review.user_id;
        const description = review.description;
        const rating = review.rating;
        const date = review.date;

        const data = {game_id, user_id, date, rating, description};

        const result = this.#updateStmt.run(data);
        if (result.changes === 0) throw new ReviewNotFound(review.id);

        return review;
    }
}

export class ReviewNotFound extends Error {
    /**
     *
     * @param {string} id
     * @param {ErrorOptions} [options]
     */
    constructor(id, options) {
        super(`Review no encontrado: ${id}`, options);
        this.name = "ReviewNoEncontrado";
    }
}

export class ReviewExists extends Error {
    /**
     *
     * @param {string} id
     * @param {ErrorOptions} [options]
     */
    constructor(id, options) {
        super(`Review already exists: ${id}`, options);
        this.name = "ReviewExists";
    }
}
