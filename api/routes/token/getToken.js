import express from 'express';
import {db} from '../../db/db.js'
import { authenticateToken } from '../../middleware/auth.js';


const router = express.Router();

router.get('/', authenticateToken,async (req, res, next) => {
    try {
      
        
            const latestValuations = await db.query(`SELECT *
                        FROM (
                            SELECT *,
                                ROW_NUMBER() OVER (PARTITION BY CODIGO_SIMBOLO ORDER BY FECHA_MODIFICACION DESC) AS rn
                            FROM pampaTokensVariations
                        ) AS ranked
                        WHERE rn <= 2
                        ORDER BY CODIGO_SIMBOLO, FECHA_MODIFICACION DESC`)

            res.status(200).json({ valuation: latestValuations[0] });
            return;
    } catch (err) {
        console.error(`error cargando datos`)
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;