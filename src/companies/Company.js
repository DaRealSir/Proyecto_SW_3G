export class Company {
    static #getAllCompanies = null;
    static #getByNameStmt = null;
    static #getbyIdStmt = null;
    static #insertCompany = null;
    static #assignCompanyGame = null;
    static #deleteCompany = null;
    static #deleteGameCompany = null;
    static #getGameWithCompany = null;
    static #getCompanyWithGame = null;
    static #unassignCompanyGame = null;
    
    #id;
    name;

    constructor(id, name) {
        this.#id = id;
        this.name = name;
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

    static initStatements(db) {
        if (this.#getByNameStmt !== null) return;
        this.#getAllCompanies = db.prepare('SELECT DISTINCT * from company ORDER BY name ASC');
        this.#getByNameStmt = db.prepare('SELECT * FROM company WHERE name = @company_name');
        this.#getbyIdStmt = db.prepare('SELECT * FROM company WHERE id = @company_id');
        this.#deleteCompany = db.prepare('DELETE FROM company WHERE id = @company_id');
        this.#deleteGameCompany = db.prepare('DELETE FROM game_company WHERE company_id = @company_id');
        this.#insertCompany = db.prepare('INSERT INTO company(name) VALUES (@company_name)');
        this.#getCompanyWithGame = db.prepare('SELECT DISTINCT company.* FROM game JOIN game_company ON game_company.game_id = @game_id JOIN company ON game_company.company_id = company.id WHERE game_company.relation = @relacion');
        this.#getGameWithCompany = db.prepare('SELECT DISTINCT game.* FROM company JOIN game_company ON game_company.company_id = @company_id JOIN game ON game.id = game_company.game_id WHERE game_company.relation = @relacion;');
        this.#assignCompanyGame = db.prepare('INSERT INTO game_company (game_id, company_id) VALUES (@game_id,@company_id)');
        this.#unassignCompanyGame = db.prepare('DELETE FROM game_company WHERE game_id = @game_id AND company_id = @company_id');
    }
    static getAllCompanies(){
        let res = this.#getAllCompanies.all();
        let ret = [];
        res.forEach(company => {
            ret.push(company.id,company.name);
        });
        return res;
    }
    static getGameCompanies(game) {
        let result = null;
        let ret = [];
        const game_id = game.id;
        const data = {game_id};
        result = this.#getCompanyWithGame.all(data);
        result.forEach(company=> {
            ret.push(new Company(company.id,company.name));
        });
        return result;
    }
    static getCompanyGames(company){
        let result = null;
        let = [];
        const company_id = company.id;
        const data = {company_id};
        result = this.#getGameWithCompany.all(data);
        result.forEach(company => {
            ret.push(new Company(company.id,company.name));
        });
        return result;
    }
    static addCompanyToGame(game, company, type) {
        let result = null;
        let ret = [];
        const game_id = game.id;
        try{
            result = this.getCompanyByName(company.name);
            ret.push(new Company(result.id,result.name));
        }
        catch(e){
            result = this.insert(company.name);
        }

        const company_id = result.id;
        let data = {game_id,company_id};

        result = this.#getCompanyWithGame.all(data);
        try{
            result = this.#assignCompanyGame.run(data);
        } catch (e) {
            throw new companyGameAlreadyExists(company_id, game_id);
        }
        return result;
    }
    static deleteCompanyFromGame(game,company){
        let result = null;
        const game_id = game.id;
        const company_id = company.id;
        let data = {company_id,game_id};
        try{
            this.#unassignCompanyGame.run(data);
        }catch(e){
            throw new companyGameNotFound(company_id,game_id);
        }
    }
    static getCompanyByName(name) {
        const company_name = name;
        const data = {company_name};
        let result = this.#getByNameStmt.get(data);
        if (result === undefined){
            throw new CompanyNotFound(name);
        }
        return new Company(result.id,result.name);
    }

    static getCompanyById(id) {
        const company_id = id;
        const data = {company_id};
        let result = this.#getbyIdStmt.get(data);
        if (result === undefined) throw new CompanyNotFound(id)
        return new Company(result.id,result.name);
    }

    static insert(company_name) {
        let result = null;
        const data = {company_name};
        let id;
        try {
            result = this.#insertCompany.run(data);
            id = result.lastInsertRowid;
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new companyAlreadyExists(company_name);
            }
            throw new ErrorDatos("Company couldn't be inserted", {cause: e});
        }
        return new Company(id,company_name);
    }
    static getGameCompany(game,type){
        let result = null;
        
    }
    static delete(company) {
        const company_id = company.#id;
        const data = {company_id};
        try {
            this.#deleteCompany.run(data);
            this.#deleteGameCompany.run(data);
        } catch (e) {
            throw new ErrorDatos("Company couldn't be deleted", {cause: e});
        }
    }

}

export class CompanyNotFound extends Error {
    /**
     *
     * @param {string} id
     * @param {ErrorOptions} [options]
     */
    constructor(id, options) {
        super(`Company not found: ${id}`, options);
        this.name = 'CompanyNotFound';

    }
}

export class companyAlreadyExists extends Error {
    /**
     *
     * @param {string} name
     * @param {ErrorOptions} [options]
     */
    constructor(name, options) {
        super(`company is already present in DB ${name}`, options);
        this.name = 'companyAlreadyExists';
    }
}

export class companyGameAlreadyExists extends Error {
    /**
     *
     * @param {string} companyId;
     * @param {string} gameId;
     * @param {ErrorOptions} [options]
     */
    constructor(companyId, gameId, options) {
        super(`company ${companyId} is already present in game ${gameId}`, options);
        this.name = 'companyGameAlreadyExists';
    }

}
export class companyGameNotFound extends Error {
    /**
     *
     * @param {string} companyId;
     * @param {string} gameId;
     * @param {ErrorOptions} [options]
     */
    constructor(companyId, gameId, options) {
        super(`company ${companyId} is couldn't be found assigned to game ${gameId}`, options);
        this.name = 'companyGameNotFound';
    }

}