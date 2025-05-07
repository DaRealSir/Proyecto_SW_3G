import express from 'express';
import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import {
    deleteUser,
    doLogin,
    doLogout,
    doRegister,
    showUserSearch,
    viewLogin,
    viewRegister,
    viewUserList,
    showUserEdit,
    doUserEdit
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
usersRouter.get('/editUser/:id', showUserEdit);
usersRouter.post('/editUser/:id',body('username','No puede ser vacio').trim().notEmpty(),
                asyncHandler(doUserEdit));
export default usersRouter;
