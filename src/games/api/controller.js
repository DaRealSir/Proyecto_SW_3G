import { validationResult, matchedData } from 'express-validator';
import { Game } from '../Game.js';

export async function checkTitle(req, res) {
    const result = validationResult(req);
    const datos = matchedData(req, { includeOptionals: true });
    if (! result.isEmpty()) {
        const errores = result.array();
        return res.status(400).json({ status: 400, errores });
    }
    const {title} = datos;
    console.log(title);
    const disponible = Game.titleAvailable(title);

    return res.status(200).json(disponible);
}