import express from 'express';
import {db} from '../../db/db.js'
import { parseFileData } from './parser.js';


const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
      
        const item = parseFileData(req.body.data);
        console.log('item', item)
    


            const { SIMBOLO, NOMBRE, VALOR_COMPRA, VALOR_VENTA, STOCK, VENCIMIENTO } = item[0];

            await db.query(`
                INSERT INTO pampaTokenVariations 
                (SIMBOLO, NOMBRE, VALOR_COMPRA, VALOR_VENTA, STOCK, VENCIMIENTO) 
                VALUES (?, ?, ?, ?, ?, ?)
            `,[SIMBOLO, NOMBRE, VALOR_COMPRA, VALOR_VENTA, STOCK, VENCIMIENTO])

            res.status(201).json({ message: 'token updated successfully' });
            return;
    } catch (err) {
        console.error(`error cargando datos`, err)

    }
});

export default router;