
import { User } from "../users/User.js";
import {Guides}  from "../guides/Guides.js";

export function viewContenidoNormal(req, res) {
    let contenido=null;
    let user=null;
    if (req.session != null ) {//Si tiene la sesion activa y un nombre en la sesion, muestra la page normal
        contenido = 'pages/profileUser';
         user = User.getUserByID(req.session.UserID)
    }
  

    res.render('page', {
        contenido,
        session: req.session,//Renderizado de la page con la info de la sesion actual
        userData: user,
    });
}

export function viewContenidoAdmin(req, res) {
    let contenido = 'pages/noPermisos';
    contenido = 'pages/admin';
    res.render('page', {
        contenido,
        session: req.session
    });
}

export function viewContenidoJournal(req, res) {
    let contenido = 'pages/noPermisos';
    contenido = 'pages/journal';
    const newslist= Guides.getAllNewsbyUser(req.session.UserID);

    res.render('page', {
        contenido,
        session: req.session,
        newslist:newslist
    });
}