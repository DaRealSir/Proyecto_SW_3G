

import { Guides } from '../guides/Guides.js';
import { UserGame } from './GameUser.js';


export function addFav(req,res)
{
    const game= req.params.game;
    const name= re1.session.UserID;
    UserGame.newUserGame(name,game);
     res.redirect(req.get('referer') || '/');
}

export function deleteFav(req,res)
{
    const game= req.params.game;
    const name= req.session.UserID;
    UserGame.deleteUserGame(name,game);

    const contenido='pages/homeUser';
    const list=UserGame.getbyUserID(name);
    const guides= Guides.getAllGuidesbyUser(name);

    res.render('page',{
        contenido:contenido,
        listGames:list,
        listGuides:guides
    });

}


