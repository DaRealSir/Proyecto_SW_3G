import express from 'express';
import { viewForum, loadThread, doCreateReply, doDeletebyId } from "./controller.js";

const forumRouter = express.Router();

forumRouter.get('/:game_id', viewForum);
forumRouter.get('/loadThread/:game_id/:thread_id/:offset', loadThread);
forumRouter.post('/reply/:game_id/:thread_id', doCreateReply);
forumRouter.post('/delete/:game_id/:thread_id', doDeletebyId);
export default forumRouter;