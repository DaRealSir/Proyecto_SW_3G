import {body} from 'express-validator';
import {RolesEnum, User} from './User.js';

export function deleteUser(req,res)
{
    console.log("HOLA");
    let contenido = 'pages/admin';

    User.delete(req.params.username);
    const userList = User.getUserList();
    console.log(req.params.username);
   
    res.render('page', {
        contenido,
        session: req.session,
        userList: userList
    });
}

export function viewUserList(req, res) {
    let contenido = 'pages/showUsersDel';


    const userList = User.getUserList();

    res.render('page', {
        contenido,
        session: req.session,
        userList: userList
    });
}

export function showUserSearch(req, res) {

    let contenido = 'pages/showUsersDel';

    const name = req.body.UserName.trim();
    const order_option = req.body.order_option;
    let order;
    switch (order_option) {
        case "optionAlfabetico":
            order = "title";
            break;
        case "optionType":
            order = "Type";
            break;
        default:
            order = "id";
            break;
    }

    const asc_desc_option = req.body.asc_desc_option;
    let order_dir;
    switch (asc_desc_option) {
        case "optionDesc":
            order_dir = 'DESC';
            break;
        case "optionAsc":
            order_dir = 'ASC';
            break;
        default:
            order_dir = 'ASC';
    }

    const userList = User.getSearchedUserList(name, order, order_dir, 50, 0);

    res.render('page', {
        contenido,
        session: req.session,
        userList: userList
    })

}

export function viewLogin(req, res) {
    let contenido = 'pages/login';//Carga la pagina
    if (req.session != null && req.session.login) {//Si ha iniciado sesio, muestra home
        contenido = 'pages/homeUser'
    }
    res.render('page', {
        contenido,
        session: req.session
    });
}

export function viewRegister(req, res) { //No se que hacer aqui :b
    let contenido = 'pages/register';//Carga la pagina
    res.render('page', {
        contenido,
        session: req.session
    });
}

export function doRegister(req, res) {
    body('username').escape();
    body('password').escape();

    // Capturo las variables username y password
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    let userValue = RolesEnum.USER;
    if (req.session.login && req.session.esAdmin) {
        console.log("Ha entrado admin");
        const user_type = req.body.userRole.trim();
        if (user_type === "admin") {
            userValue = RolesEnum.ADMIN;
        } else {
            userValue = RolesEnum.PERIODISTA;
        }
        try {
            const usuario = User.register(username,password,userValue);
            
            res.render('page', {
                contenido: 'pages/homeUser',

            })

        } catch (e) {
            res.render('page', {
                contenido: 'pages/register',
                error: 'No se pudo registrar el usuario'
            })
        }
    } else {

        try {
            console.log("Voy a registrar:", username, userValue);
            const usuario = User.register(username, password, userValue);
            req.session.login = true;
            req.session.UserID = usuario.id;
            req.session.esAdmin = usuario.user_type === RolesEnum.ADMIN;
            req.session.esJournal = usuario.user_type === RolesEnum.PERIODISTA

            res.render('page', {
                contenido: 'pages/homeUser',

            })

        } catch (e) {
            res.render('page', {
                contenido: 'pages/register',
                error: 'No se pudo registrar el usuario'
            })
        }
    }

}

export function doLogin(req, res) {
    body('username').escape();
    body('password').escape();
    // Capturo las variables username y password
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    try {
        const usuario = User.login(username, password);
        console.log(usuario);
        req.session.login = true;
        req.session.UserID = usuario.id;
        req.session.esAdmin = usuario.user_type === RolesEnum.ADMIN;
        req.session.esJournal = usuario.user_type === RolesEnum.PERIODISTA;

/*
        console.log(usuario);
        console.log(usuario.user_type);
        console.log(req.session.esAdmin);
*/
        return res.render('page', {
            contenido: 'pages/homeUser',
            session: req.session
        });

    } catch (e) {
        console.log(e);
        res.render('page', {
            contenido: 'pages/login',
            error: 'El usuario o contraseña no son válidos'
        })
    }
}

export function doLogout(req, res, next) {
    // https://expressjs.com/en/resources/middleware/session.html
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.login = null
    req.session.UserID = null;
    req.session.esAdmin = null;
    req.session.save((err) => {
        if (err) next(err);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
            if (err) next(err)
            res.redirect('/');
        })
    })
}
