import * as console from "node:console";
import * as bcrypt from "bcryptjs";

export const RolesEnum = Object.freeze({
    USER: 'U',
    ADMIN: 'A',
    PERIODISTA: 'P'
});

export class User {

    static #getByUsernameStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #getByIdStmt = null;
    static #countofUserSmt = null;
    static #getAllUsersStmt = null;
    static #getSearchedListGamesAscStmt = null;
    static #getSearchedListGamesDescStmt = null;
    static #deleteUser = null;

    #id;
    #username;
    #password;
    #bio;
    #profile_picture;
    #user_type;

    constructor(username, bio, password, profile_picture, user_type, id) {
        this.#username = username;
        this.#bio = bio;
        this.#password = password;
        this.#profile_picture = profile_picture;
        this.#user_type = user_type;
        this.#id = id;
    }

    set password(newPassword) {
        this.#password = bcrypt.hashSync(newPassword);
    }

    get bio() {
        return this.#bio;
    }

    set bio(value) {
        this.#bio = value;
    }

    get profile_picture() {
        return this.#profile_picture;
    }

    set profile_picture(value) {
        this.#profile_picture = value;
    }

    static initStatements(db) {
        this.#deleteUser = db.prepare('DELETE FROM user WHERE id = @id');
        this.#countofUserSmt = db.prepare('SELECT COUNT(*) AS count FROM user WHERE username = @username');
        this.#getByUsernameStmt = db.prepare('SELECT * FROM user WHERE username = @username');
        this.#getByIdStmt = db.prepare('SELECT * FROM user WHERE id = @id');
        this.#insertStmt = db.prepare('INSERT INTO user(username, bio, password, profile_picture, user_type) VALUES (@username, @bio, @password, @profile_picture, @user_type)');
        this.#updateStmt = db.prepare('UPDATE user SET username = @username, bio = @bio, password = @password,  profile_picture = @profile_picture, user_type = @user_type WHERE id = @id');
        this.#getAllUsersStmt = db.prepare("SELECT * FROM user WHERE username != 'Borrado'");
        this.#getSearchedListGamesAscStmt = db.prepare(`SELECT * FROM user WHERE username LIKE @username ORDER BY 
                                                            CASE 
                                                                WHEN @orderBy = 'title' THEN username
                                                                WHEN @orderBy = 'Type' THEN user_type
                                                                ELSE id
                                                             END 
                                                             ASC
                                                         LIMIT @number OFFSET @offset`);
        this.#getSearchedListGamesDescStmt = db.prepare(`SELECT * FROM user WHERE username LIKE @username ORDER BY 
                                                            CASE 
                                                                WHEN @orderBy = 'title' THEN username
                                                                WHEN @orderBy = 'Type' THEN user_type
                                                                ELSE id
                                                             END 
                                                             DESC
                                                         LIMIT @number OFFSET @offset`);
    }

    static getUserList() {
        const userList = this.#getAllUsersStmt.all();
        if (userList === undefined) throw new userNotFound(userList);
        return userList;
    }

    static getSearchedUserList(name, order, order_dir, number, offset) {
        if (number === undefined) number = 20;
        if (offset === undefined) offset = 0;

        const searchedTitle = `%${name}%`;
        let userList;
        if (order_dir === 'ASC')
            userList = this.#getSearchedListGamesAscStmt.all({username: searchedTitle, orderBy: order, number, offset});
        else
            userList = this.#getSearchedListGamesDescStmt.all({
                username: searchedTitle,
                orderBy: order,
                number,
                offset
            });

        if (userList === undefined) throw new userNotFound(userList);
        return userList;
    }

    static getUserByUsername(username) {
        const user = this.#getByUsernameStmt.get({username});
        if (user === undefined) throw new userNotFound(username);
        const {bio, password, profile_picture, user_type, id} = user;
        return new User(username, bio, password, profile_picture, user_type, id);
    }

    static getUserByID(id) {
        const user = this.#getByIdStmt.get({id});
        if (user == undefined) throw new userNotFound(id);
        const {username, bio, password, profile_picture, user_type} = user;
        return new User(username, bio, password, profile_picture, user_type, id);
    }

    static ExistingUsers(username) {
        const numberOfUser = this.#countofUserSmt.get({username});
        return numberOfUser;
    }

    static #insert(user) {
        let result = null;
        try {
            const datos = {
                username: user.#username,
                bio: user.#bio,
                password: user.#password,
                profile_picture: user.#profile_picture,
                user_type: user.#user_type
            };

            const counterUser = this.ExistingUsers(user.#username);
            if (counterUser.count > 0) {
                throw new userAlreadyExists;
            }

            result = this.#insertStmt.run(datos);
            user.#id = result.lastInsertRowid;
        } catch (e) {
            throw new userAlreadyExists(user.#username);
        }
        return user;
    }

    static disableUpdate(username) {
        try {
            const user = this.getUserByUsername(username);
            this.#updateStmt.run({
                username: "Borrado",
                bio: null,
                password: "NO",
                profile_picture: null,
                user_type: RolesEnum.USER,
                id: user.id
            });
        } catch (e) {
            throw new userNotFound(username);
        }
    }

    static #update(user) {
        const datos = {
            username: user.#username,
            bio: user.#bio,
            password: user.#password,
            profile_picture: user.#profile_picture,
            user_type: user.#user_type,
            id: user.#id
        };
        this.#updateStmt.run(datos);
        return user;
    }

    static register(username, password, userValue) {
        const cryptPass = bcrypt.hashSync(password);
        let user = new User(username, null, cryptPass, null, userValue, null);
        user = this.#insert(user);
        return user;
    }

    static login(username, password) {
        let user = null;
        try {
            user = this.getUserByUsername(username);
        } catch (e) {
            throw new userOPasswordNoValido(username, {cause: e});
        }
        if (!bcrypt.compareSync(password, user.#password)) throw new userOPasswordNoValido(password);
        return user;
    }

    static delete(username) {
        let user = null;
        try {
            user = this.getUserByUsername(username);
        } catch (e) {
            throw new userOPasswordNoValido(username, {cause: e});
        }
        this.#deleteUser.run({id: user.#id});
    }

    persist() {
        if (this.#id === null) return User.#insert(this);
        return User.#update(this);
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get user_type() {
        return this.#user_type;
    }

    set user_type(value) {
        this.#user_type = value;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    set profile_picture(profile_picture){
        this.#profile_picture=profile_picture;
    }
    get profile_picture()
    {
        return this.#profile_picture;
    }
}

export class userNotFound extends Error {
    constructor(username, options) {
        super(`user no encontrado: ${username}`, options);
        this.name = 'userNotFound';
    }
}

export class userOPasswordNoValido extends Error {
    constructor(username, options) {
        super(`user o password no válido: ${username}`, options);
        this.name = 'userOPasswordNoValido';
    }
}

export class userAlreadyExists extends Error {
    constructor(username, options) {
        super(`user ya existe: ${username}`, options);
        this.name = 'userAlreadyExists';
    }
}

export class userNotRegistered extends Error {
    constructor(username, options) {
        super(`Something happened, try again later`, options);
        this.name = 'userNotRegistered';
    }
}
