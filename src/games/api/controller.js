import { validationResult, matchedData } from 'express-validator';
import { Usuario } from '../Usuario.js';

export async function checkUsername(req, res) {
    const result = validationResult(req);
    const datos = matchedData(req, { includeOptionals: true });
    if (! result.isEmpty()) {
        const errores = result.array();
        return res.status(400).json({ status: 400, errores });
    }
    const { username } = datos;
    const disponible = ! Usuario.existeUsername(username);

    return res.status(200).json(disponible);
}