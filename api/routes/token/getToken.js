import express from 'express';
import {db} from '../../db/db.js'
import { authenticateToken } from '../../middleware/auth.js';


const router = express.Router();

router.get('/', authenticateToken,async (req, res, next) => {
    try {
      
        
            const latestValuations = await db.query(`SELECT *
                        FROM (
                            SELECT *,
                                ROW_NUMBER() OVER (PARTITION BY SIMBOLO ORDER BY FECHA_MODIFICACION DESC) AS rn
                            FROM pampaTokenVariations
                        ) AS ranked
                        WHERE rn <= 2
                        ORDER BY SIMBOLO, FECHA_MODIFICACION DESC`)

            res.status(200).json({ valuation: latestValuations[0] });
            return;
    } catch (err) {
        console.error(`error cargando datos`)

    }
});

export default router;