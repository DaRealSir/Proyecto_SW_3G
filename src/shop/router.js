import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import express from 'express';

import { autenticado } from '../middleware/auth.js';
import {

} from "./controller.js";


const shopRouter = express.Router();

export default shopRouter; 