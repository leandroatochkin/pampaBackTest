import express from 'express';
import {db} from '../../db/db.js'
import { parseVerifierFileData } from './verifierParser.js';


const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
      
        const item = parseVerifierFileData(req.body.data);
        console.log('item', item)
        if (!item || item.length === 0) {
            return res.status(400).json({ message: 'No data provided or data is invalid' });
        }
        // Check if the token already exists
        for (const data of item) {
                const { CUIT, APELLIDO, NOMBRE, ESTADO } = data
                await db.query(`
                UPDATE users SET isVerified = ? WHERE CUIT = ? AND firstName = ? AND lastName = ?
            `,[ESTADO, CUIT, NOMBRE, APELLIDO])
        }

            
            res.status(201).json({ message: 'users verified successfully' });
            return;
    } catch (err) {
        console.error(`error cargando datos`, err)
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;