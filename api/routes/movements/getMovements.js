import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { db } from '../../db/db.js'; // Adjust the path as necessary
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.query
    if(!userId){
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const movements = await db.query(`
            SELECT * FROM operations WHERE userId = ?
            `,[userId])
            console.log(movements)
            if (!Array.isArray(movements) || movements.length === 0) {
                res.status(200).json({ message: 'No movements found for this user' })
                return
              }

              return res.status(200).json(movements[0])
    } catch(e){
        console.log(e)
    }
})

export default router;