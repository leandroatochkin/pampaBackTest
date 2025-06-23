import express from 'express';
import { db } from '../../db/db.js';
import { authenticateToken } from '../../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { logTradeOperation } from '../../../helpers/logTradeOperation.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { userId, amount, symbol, boughtAtValue, tokenName, tokenExpiringDate } = req.body;

    if (!userId || amount == null || !symbol || !boughtAtValue) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const operationId = uuidv4();
    const connection = await db.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction();

        // Step 1: Insert into operations
        await connection.query(
            `INSERT INTO operations (userId, operationId, amount, operationType, symbol, value) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, operationId, amount, 0, symbol, boughtAtValue * amount]
        );

        // Step 2: Check if userToken exists
        const [existingRows] = await connection.query(
            `SELECT * FROM userTokens WHERE userId = ? AND tokenSymbol = ?`,
            [userId, symbol]
        );

        if (existingRows.length === 0) {
            // Step 2a: Insert new token entry
            await connection.query(
                `INSERT INTO userTokens (userId, tokenSymbol, tokenName, tokenAmount, tokenPaidPrice, tokenExpiringDate) VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, symbol, tokenName, amount, boughtAtValue, tokenExpiringDate]
            );
        
        

        } else {
            // Step 2b: Update existing token entry
            await connection.query(
                `UPDATE userTokens SET tokenAmount = tokenAmount + ?, tokenPaidPrice = ? WHERE userId = ? AND tokenSymbol = ?`,
                [amount, boughtAtValue, userId, symbol]
            );
        }

        //start registry process

        const getCUITresults = await connection.query(
            `SELECT CUIT FROM users WHERE id = ?`,
            [userId]
        )
        
        const userCUIT = getCUITresults[0][0].CUIT
        const operationDTO = {
            CUIT: userCUIT,
            operationType: 0,
            token: symbol,
            amount: amount,
            price: boughtAtValue
        }

        await logTradeOperation(operationDTO)

        await connection.commit();
        res.status(200).json({ message: 'Operation successful' });
    } catch (err) {
        await connection.rollback();
        console.error('Transaction failed:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
});

export default router;
