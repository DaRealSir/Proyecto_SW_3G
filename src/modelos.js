import {Game} from "./games/Game.js";
import {User} from "./users/User.js";
import { Forum } from "./forum/Forum.js";
import {Review} from "./reviews/Review.js";
import {Genre} from "./genres/Genre.js";
import {Guides} from "./guides/Guides.js";

export function inicializaModelos(db) {
    Game.initStatements(db);
    User.initStatements(db);
    Genre.initStatements(db);
    Review.initStatements(db);
    Forum.initStatements(db);
    Guides.initStatements(db);
}
