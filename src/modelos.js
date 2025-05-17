import {Game} from "./games/Game.js";
import {User} from "./users/User.js";
import { Forum } from "./forum/Forum.js";
import {Review} from "./reviews/Review.js";
import {Genre} from "./genres/Genre.js";
import { Shop } from "./shop/Shop.js";
import {Guides} from "./guides/Guides.js";
import { UserGame } from "./game_user/GameUser.js";


import {Company} from "./companies/Company.js";
export function inicializaModelos(db) {
    Game.initStatements(db);
    User.initStatements(db);
    Genre.initStatements(db);
    Review.initStatements(db);
    Forum.initStatements(db);
    Shop.initStatements(db);
    Guides.initStatements(db);
    Company.initStatements(db);
    UserGame.initStatements(db);
}
