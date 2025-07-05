import express from 'express';
import {db} from '../../db/db.js'
import { parseFileData } from './parser.js';


const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
      
        const item = parseFileData(req.body.data);
        console.log('item', item)
        if (!item || item.length === 0) {
            return res.status(400).json({ message: 'No data provided or data is invalid' });
        }
        // Check if the token already exists
        for (const data of item) {
                const { CODIGO_GRUPO, CODIGO_SIMBOLO, DES_SIMBOLO, VALOR_COMPRA, VALOR_VENTA, FECHA } = data
                await db.query(`
                INSERT INTO pampaTokenVariations 
                (CODIGO_GRUPO, CODIGO_SIMBOLO, DES_SIMBOLO, VALOR_COMPRA, VALOR_VENTA, FECHA) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,[CODIGO_GRUPO, CODIGO_SIMBOLO, DES_SIMBOLO, VALOR_COMPRA, VALOR_VENTA, FECHA])
        }

            
            res.status(201).json({ message: 'token updated successfully' });
            return;
    } catch (err) {
        console.error(`error cargando datos`, err)

    }
});

export default router;