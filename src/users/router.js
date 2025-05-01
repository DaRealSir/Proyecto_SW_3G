import express from 'express';
import {
    deleteUser,
    doLogin,
    doLogout,
    doRegister,
    showUserSearch,
    viewLogin,
    viewRegister,
    viewUserList
} from './controller.js';

const usersRouter = express.Router();

usersRouter.get('/login', viewLogin);
usersRouter.post('/login', doLogin);
usersRouter.get('/logout', doLogout);
usersRouter.post('/register', doRegister);
usersRouter.get('/register', viewRegister)
usersRouter.get('/register', viewRegister);
usersRouter.get('/listausuarios', viewUserList);
usersRouter.post('/listausuarios', showUserSearch);
usersRouter.post('/delete/:id', deleteUser);
export default usersRouter;
