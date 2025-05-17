import {GameNotFound} from "../games/Game.js";

export const GuideTypeEnum = Object.freeze({
    NEWS: 'N',
    GUIDE: 'G'
});


export class Guides{
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get user_id() {
        return this._user_id;
    }

    set user_id(value) {
        this._user_id = value;
    }

    get game_id() {
        return this._game_id;
    }

    set game_id(value) {
        this._game_id = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }

    get guide_type() {
        return this._guide_type;
    }
    set guide_type(value) {
        this._guide_type = value;
    }

    #id;
    game_id;
    user_id;
    content;
    title;
    guide_type;
    date;

    static #getByTitleStmt = null;
    static #getByUserStmt = null;
    static #getByGameStmt = null;
    static #getAllGuidesStmt = null;
    static #insertGuideStmt = null;
    static #deleteGuideStmtById = null;
    static #getByIdStmt = null;
    static #getNewsbyIdStmt=null;
    static #getGuidesbyIdStmt=null;
    static #updateGuideStmt = null;
    static #getListGuidesInitFinalStmt = null;


    constructor(id, user_id, game_id, date, content, title, guide_type) {
        this._id = id;
        this._user_id = user_id;
        this._game_id = game_id;
        this._date = date;
        this._content = content;
        this._title = title;
        this._guide_type = guide_type;
    }

    static initStatements(db){
        if(this.#getByTitleStmt !== null) return;
        //this.#getByTitleStmt = db.prepare('SELECT * FROM guides WHERE title = @title');
        this.#getByGameStmt = db.prepare('SELECT * FROM guides WHERE game_id = @game_id');
        this.#getByUserStmt = db.prepare('SELECT * FROM guides WHERE user_id = @user_id');
        this.#getAllGuidesStmt = db.prepare('SELECT * FROM guides');
        this.#insertGuideStmt = db.prepare('INSERT INTO guides(user_id, game_id, date, content, title, guide_type) VALUES (@user_id, @game_id, @date, @content, @title, @guide_type)');
        this.#deleteGuideStmtById = db.prepare('DELETE FROM guides WHERE id = @id');
        this.#getByIdStmt = db.prepare('SELECT * FROM guides WHERE id = @id');
        this.#getNewsbyIdStmt=db.prepare("SELECT * FROM guides where user_id=@user_id AND guide_type='N'");
        this.#getGuidesbyIdStmt=db.prepare("SELECT * FROM guides where user_id=@user_id AND guide_type='G'");
    }
        this.#updateGuideStmt = db.prepare(`UPDATE guides SET title = @title,content = @content, guide_type = @guide_type WHERE id = @id`);
        this.#getListGuidesInitFinalStmt = db.prepare(`
            SELECT 
                g.id AS guide_id, 
                u.username AS user_name, 
                game.title AS game_name, 
                g.title AS guide_title, 
                g.content AS guide_content, 
                g.guide_type AS guide_type, 
                g.date AS guide_date
            FROM guides g
            JOIN user u ON g.user_id = u.id
            JOIN game ON g.game_id = game.id
            ORDER BY g.date DESC
            LIMIT @number OFFSET @offset;
        `);


    static getAllNews(user_id)
    {
        const ret= this.#getNewsbyIdStmt.run(user_id);

        return ret;
    }

    static getAllGuides(user_id)
    {
        const ret = this.#getNewsbyIdStmt.run(user_id);
        return ret;
    }

    static getGuideById(id){
        const guide = this.#getByIdStmt.get({id});
        if(guide === undefined) throw new GuideNotFound(id);
        const {user_id, game_id, date, content, title, guide_type} = guide;
        return new Guides(id, user_id, game_id, date, content, title, guide_type);
    }

    static getGuideByTitle(requestedTitle){
        const guide = this.#getByTitleStmt.get({requestedTitle});
        if(guide === undefined) throw new GuideNotFound(requestedTitle);
        const {id, user_id, game_id, date, content, title, guide_type} = guide;
        return new Guides(id, user_id, game_id, date, content, title, guide_type);
    }

    static getGuideByGame(gameId){
        const guide = this.#getByGameStmt.all({game_id: gameId});
        if(guide === undefined) throw new GuideNotFound(gameId);
        return guide;
    }

    static getGuideByUser(userId){
        const guide = this.#getByGameStmt.all({userId});
        if(guide === undefined) throw new GuideNotFound(userId);
        return guide;
    }

    static getAllGuides(){
        const guide = this.#getAllGuidesStmt.all();
        if(guide === undefined) throw new GuideNotFound();
        return guide;

    }

    static insertGuide(guide){
        const result = this.#insertGuideStmt.run({user_id: guide._user_id,
            game_id: guide._game_id,
            date: guide._date,
            content: guide._content,
            title: guide._title,
            guide_type: guide._guide_type});

        guide.#id = result.lastInsertRowid;
        return guide;
    }

    static deleteGuide(id){
        const result = this.#deleteGuideStmtById.run(id);
        if(result.changes === 0) throw new GuideNotFound();
    }

    static getUpdateStmt() {

        return this.#updateGuideStmt;
    }

    static getGuideListLimited(number, offset) {
        const gameList = this.#getListGuidesInitFinalStmt.all({number, offset});
        if (gameList === undefined) throw new GameNotFound(gameList);

        return gameList;
    }
}

export class GuideNotFound extends Error {
    constructor(title, options) {
        super(`Guide no encontrado: ${title}`, options);
        this.name = "GuideNotFound";
    }
}