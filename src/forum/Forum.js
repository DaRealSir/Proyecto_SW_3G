export class Forum {
    static #getByIdStmt = null;
    static #getByGameIdsStmt = null;
    static #getByGameStmt = null;
    static #getLastPostGameStmt = null;
    static #getRepliesStmt = null;
    static #insertThreadStmt = null;
    static #insertReplyStmt = null;
    static #updateReplyCountStmt = null;
    static #updatePostStmt = null;
    static #updatePositionStmt = null;
    static #getThreadByIdStmt = null;
    static #getNextPostByIdStmt = null;
    static #deleteStmt = null;
    static #NUMBER_OF_THREADS = 5;
    static #NUMBER_OF_REPLIES = 3;

    static initStatements(db) {
        if (this.#getByIdStmt !== null) return;
        let str = "";
        for (let i = 1; i < this.#NUMBER_OF_THREADS; i++) {
            str += ` OR (forum_post.original_post_id = @ids${i} AND forum_post.position_post > @max${i}-${this.#NUMBER_OF_REPLIES} AND forum_post.position_post <= @max${i})`;
        }

        this.#getByIdStmt = db.prepare('SELECT * FROM forum_post WHERE id = @id');
        this.#getThreadByIdStmt = db.prepare(`
            SELECT forum_post.*, user.username as user_name
            FROM forum_post
            JOIN user ON forum_post.user_id = user.id
            WHERE forum_post.game_id = @game_id 
            AND forum_post.original_post_id = @last_id 
            AND forum_post.position_post > @offset-@cant AND forum_post.position_post <= @offset
            ORDER BY forum_post.position_post DESC
        `);
        this.#getNextPostByIdStmt = db.prepare('SELECT forum_post.*, user.username as user_name FROM forum_post JOIN user ON forum_post.user_id = user.id WHERE game_id = @game_id AND original_post_id = @last_id LIMIT 1 OFFSET @offset');
        this.#getByGameIdsStmt = db.prepare(`
            SELECT forum_post.id, forum_post.replies
            FROM forum_post
            WHERE game_id = @game_id AND original_post_id = -1
            AND forum_post.position_post > @offset - ${this.#NUMBER_OF_THREADS}
            AND forum_post.position_post <= @offset
            ORDER BY position_post DESC
        `);
        this.#getLastPostGameStmt = db.prepare(`
            SELECT forum_post.position_post FROM forum_post
            WHERE game_id = @game_id AND original_post_id = -1
            ORDER BY position_post DESC
            LIMIT 1 OFFSET 0
        `);
        this.#getByGameStmt = db.prepare(`
            SELECT forum_post.*, user.username as user_name
            FROM forum_post
            LEFT JOIN user ON forum_post.user_id = user.id
            WHERE game_id = @game_id AND ((forum_post.original_post_id = -1 AND forum_post.position_post > @offset - ${this.#NUMBER_OF_THREADS} AND forum_post.position_post <= @offset)${str})
            ORDER BY position_post DESC
        `);
        this.#getRepliesStmt = db.prepare('SELECT replies FROM forum_post WHERE id = @post_id');
        this.#insertThreadStmt = db.prepare('INSERT INTO forum_post (game_id, original_post_id, title, description, user_id) VALUES (@game_id, -1, @title, @description, @user_id)');
        this.#insertReplyStmt = db.prepare('INSERT INTO forum_post (game_id, original_post_id, title, description, user_id, position_post) VALUES (@game_id, @original_post_id, @title, @description, @user_id, @num_replies)');
        this.#updateReplyCountStmt = db.prepare('UPDATE forum_post SET replies = replies + @cant WHERE id = @post_id');
        this.#updatePostStmt = db.prepare('UPDATE forum_post SET title = @title, description = @description WHERE id = @post_id');
        this.#updatePositionStmt = db.prepare('UPDATE forum_post SET position_post = position_post-1 WHERE original_post_id = @orignial_post_id AND position_post > @position_post');
        this.#deleteStmt = db.prepare('DELETE FROM forum_post WHERE game_id = @game_id AND id = @thread_id');
    }

    static getPostById(id) {
        const thread = this.#getByIdStmt.get({ id });
        if (!thread) throw new ForumNotFound(id);
        return new Forum(thread.id, thread.game_id, thread.original_post_id, thread.title, thread.description, thread.user_id, thread.replies);
    }

    static getThreadById(game_id, last_id, cant, offset) {
        const rows = this.#getThreadByIdStmt.all({ game_id, last_id, cant, offset });
        return rows.map(row => new Forum(row.id, row.game_id, row.original_post_id, row.title, row.description, row.user_id, row.replies, row.user_name));
    }

    static getThreadsByGame(game_id) {
        const lastPost = this.#getLastPostGameStmt.get({ game_id });
        let lp = lastPost ? lastPost.position_post : 0;

        const ids = this.#getByGameIdsStmt.all({ game_id, offset: lp });
        ids.push({ id: -1, replies: 0 });
        while (ids.length < this.#NUMBER_OF_THREADS) {
            ids.push({ id: -5, replies: 0 });
        }

        const rows = this.#getByGameStmt.all({
            game_id,
            ids1: ids[0].id, ids2: ids[1].id, ids3: ids[2].id, ids4: ids[3].id, ids5: ids[4].id,
            max1: ids[0].replies, max2: ids[1].replies, max3: ids[2].replies, max4: ids[3].replies, max5: ids[4].replies,
            offset: lp
        });

        return rows.map(row => new Forum(row.id, row.game_id, row.original_post_id, row.title, row.description, row.user_id, row.replies, row.user_name));
    }

    static getLastPostGame(game_id) {
        return this.#getLastPostGameStmt.get({ game_id });
    }

    static getReplies(post_id, game_id = -1) {
        if (post_id == -1) {
            const lastPost = this.#getLastPostGameStmt.get({ game_id });
            return lastPost ? lastPost.position_post : 0;
        }
        return this.#getRepliesStmt.get({ post_id }).replies;
    }

    static createReply(game_id, original_post_id,title, description, user_id) {
        const num_replies = parseInt(this.getReplies(original_post_id, game_id)) + 1;
        if(original_post_id != -1) {
            this.#updateReplyCountStmt.run({ post_id: original_post_id, cant: 1 }); // Actualiza el número de respuestas
        }
        
        const result = this.#insertReplyStmt.run({ game_id, original_post_id, title, description, user_id, num_replies});

        return true;
    }
    static updatePost(post_id, title, description) {
        const result = this.#updatePostStmt.run({ post_id, title, description });
        if (result.changes === 0) {
            throw new ForumNotFound(post_id);
        }
        return true;

    }
    static delete(game_id, thread_id) {
        const post = this.getPostById(thread_id);
        this.#updatePositionStmt.run({ orignial_post_id: post.original_post_id, position_post: post.position_post });
        const parentPostID = post.original_post_id;
        const result = this.#deleteStmt.run({ game_id, thread_id });
        if(parentPostID != -1)
        {
            this.#updateReplyCountStmt.run({ post_id: parentPostID, cant: -1 }); // Actualiza el número de respuestas
        }
        if (result.changes === 0) {
            throw new ForumNotFound(thread_id);
        }
        return result.changes;
    }
    constructor(id, game_id, original_post_id, title, description, user_id, replies = 0, user_name = null) {
        this.id = id;
        this.game_id = game_id;
        this.original_post_id = original_post_id;
        this.title = title;
        this.description = description;
        this.user_id = user_id;
        this.replies = replies;
        this.user_name = user_name;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get game_id() { return this._game_id; }
    set game_id(value) { this._game_id = value; }

    get original_post_id() { return this._original_post_id; }
    set original_post_id(value) { this._original_post_id = value; }

    get title() { return this._title; }
    set title(value) { this._title = value; }

    get description() { return this._description; }
    set description(value) { this._description = value; }

    get user_id() { return this._user_id; }
    set user_id(value) { this._user_id = value; }

    get replies() { return this._replies; }
    set replies(value) { this._replies = value; }

    get user_name() { return this._user_name; }
    set user_name(value) { this._user_name = value; }
}

export class ForumNotFound extends Error {
    constructor(id, options) {
        super(`Forum post not found: ${id}`, options);
        this.name = 'ForumNotFound';
    }
}