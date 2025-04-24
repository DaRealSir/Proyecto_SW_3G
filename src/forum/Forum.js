export class Forum {
    static #getByIdStmt = null;
    static #getByGameIdsStmt = null;
    static #getByGameStmt = null;
    static #getLastPostGameStmt = null;
    static #getRepliesStmt = null;
    static #insertThreadStmt = null;
    static #insertReplyStmt = null;
    static #updateReplyCountStmt = null;
    static #getThreadByIdStmt = null;
    static #getNextPostByIdStmt = null;
    static #deleteStmt = null;
    static #NUMBER_OF_THREADS = 5;
    static #NUMBER_OF_REPLIES = 3;

    static initStatements(db) {
        if (this.#getByIdStmt !== null) return;
        let str ="";
        for(let i = 1; i < this.#NUMBER_OF_THREADS; i++) {
            str += ` OR (forum_post.original_post_id = @ids${i} AND forum_post.position_post <= ${this.#NUMBER_OF_REPLIES})`;

        }

        this.#getByIdStmt = db.prepare('SELECT * FROM forum_post WHERE id = @id');
        this.#getThreadByIdStmt = db.prepare(`
            SELECT forum_post.*, user.username as user_name
            FROM forum_post
            JOIN user ON forum_post.user_id = user.id
            WHERE forum_post.game_id = @game_id 
            AND forum_post.original_post_id = @last_id 
            AND forum_post.position_post > @offset AND forum_post.position_post <= @cant+@offset
        `);
        this.#getNextPostByIdStmt = db.prepare('SELECT forum_post.*, user.username as user_name FROM forum_post JOIN user ON forum_post.user_id = user.id WHERE game_id = @game_id AND original_post_id = @last_id LIMIT 1 OFFSET @offset');
        this.#getByGameIdsStmt = db.prepare(`
                SELECT forum_post.id 
                FROM forum_post
                WHERE game_id = @game_id AND original_post_id = -1
                AND forum_post.position_post <= ${this.#NUMBER_OF_THREADS}
            `);
        this.#getLastPostGameStmt = db.prepare(`
            SELECT forum_post.position_post FROM forum_post
            WHERE game_id = @game_id AND original_post_id = -1
            ORDER BY position_post DESC
            LIMIT 1 OFFSET 0
            `);
        this.#getByGameStmt = db.prepare(`
            SELECT forum_post.* , user.username as user_name
            FROM forum_post
            LEFT JOIN user ON forum_post.user_id = user.id
            WHERE game_id = @game_id AND ((forum_post.original_post_id = -1 AND forum_post.position_post <= ${this.#NUMBER_OF_THREADS} )${str})
        `);
        this.#getRepliesStmt = db.prepare('SELECT replies FROM forum_post WHERE id = @post_id');
        this.#insertThreadStmt = db.prepare('INSERT INTO forum_post (game_id, original_post_id, title, description, user_id) VALUES (@game_id, -1, @title, @description, @user_id)');
        this.#insertReplyStmt = db.prepare('INSERT INTO forum_post (game_id, original_post_id, description, user_id) VALUES (@game_id, @original_post_id, @description, @user_id)');
        this.#updateReplyCountStmt = db.prepare('UPDATE forum_post SET replies = replies + 1 WHERE id = @post_id');
        this.#deleteStmt = db.prepare('DELETE FROM forum_post WHERE game_id = @game_id AND id = @thread_id');
    }

    static getPostById(id) {
        const thread = this.#getByIdStmt.get({ id });
        if (!thread) throw new ForumNotFound(id);
        return thread;
    }

    static getThreadById(game_id, last_id, cant, offset) {
        const thread = this.#getThreadByIdStmt.all({ game_id, last_id, cant, offset });
        const nextPost = this.#getNextPostByIdStmt.get({ game_id, last_id, offset: (+offset) + (+cant) });
        const showMore = nextPost ? true : false;
        if (showMore) {
            thread.showMore = true;
        } else {
            thread.showMore = false;
        }
        thread.last_id = last_id;
        return thread;
    }

    static getThreadsByGame(game_id) {
        let ids = this.#getByGameIdsStmt.all({ game_id});
        ids.push({ id: -1 });
        while (ids.length < this.#NUMBER_OF_THREADS) {
            ids.push({ id: -5 });
        }
        const threadList = this.#getByGameStmt.all({ game_id, ids1: ids[0].id, ids2: ids[1].id, ids3: ids[2].id, ids4: ids[3].id, ids5: ids[4].id });
        const lastPost = this.#getLastPostGameStmt.get({ game_id });
        if (lastPost) {
            threadList.last_post = lastPost.position_post;
        } else {
            threadList.last_post = 0;
        }
        return threadList;
    }
    static getLastPostGame(game_id) {
        const lastPost = this.#getLastPostGameStmt.all({ game_id });
    }
    static getReplies(post_id, game_id = -1) {
        if (post_id == -1) {           
            return this.#getLastPostGameStmt.get({ game_id: game_id }).position_post;
        }
        return this.#getRepliesStmt.get({ post_id }).replies;
    }

    static createReply(game_id, original_post_id, description, user_id) {
        const result = this.#insertReplyStmt.run({ game_id, original_post_id, description, user_id });
        if(game_id != -1) {
            this.#updateReplyCountStmt.run({ post_id: original_post_id }); // Actualiza el número de respuestas
        }
        return result.lastInsertRowid;
    }
    static delete(game_id, thread_id) {
        const result = this.#deleteStmt.run({ game_id, thread_id });
        if (result.changes === 0) {
            throw new ForumNotFound(thread_id);
        }
        return result.changes;
    }
    constructor(id, game_id, original_post_id, title, description, user_id, replies = 0) {
        this.id = id;
        this.game_id = game_id;
        this.original_post_id = original_post_id;
        this.title = title;
        this.description = description;
        this.user_id = user_id;
        this.replies = replies;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get game_id() {
        return this._game_id;
    }

    set game_id(value) {
        this._game_id = value;
    }

    get original_post_id() {
        return this._original_post_id;
    }

    set original_post_id(value) {
        this._original_post_id = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get user_id() {
        return this._user_id;
    }

    set user_id(value) {
        this._user_id = value;
    }

    get replies() {
        return this._replies;
    }

    set replies(value) {
        this._replies = value;
    }
}

export class ForumNotFound extends Error {
    constructor(id, options) {
        super(`Forum post not found: ${id}`, options);
        this.name = 'ForumNotFound';
    }
}
