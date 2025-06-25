import express from 'express';
import {db} from '../../db/db.js'
import { authenticateToken } from '../../middleware/auth.js';


const router = express.Router();

router.get('/', authenticateToken,async (req, res, next) => {

const {userId} = req.query

    try {
            const user = await db.query(`SELECT * FROM users WHERE id = ?`,[userId])

            res.status(200).json({ user: user[0] });
            return;
    } catch (err) {
        console.error(`server error`)
        res.status(500).json({error: `server error`})
    }
});

export default router;