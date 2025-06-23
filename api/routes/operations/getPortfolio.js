import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { db } from '../../db/db.js'; // Adjust the path as necessary
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.query
    console.log('user id:', userId)
    if(!userId){
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const portfolio = await db.query(`
            SELECT * FROM userTokens WHERE userId = ?
            `,[userId])
            console.log(portfolio)
            if (!Array.isArray(portfolio) || portfolio.length === 0) {
                res.status(200).json({ message: 'No portfolio found for this user' })
                return
              }

              return res.status(200).json(portfolio[0])
    } catch(e){
        console.log(e)
    }
})

export default router;