import express from 'express';
import { db } from '../../db/db.js';
import { authenticateToken } from '../../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { userId, amount, symbol, soldAtValue } = req.body;

    if (!userId || amount == null || !symbol || !soldAtValue) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const operationId = uuidv4();
    const connection = await db.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction();

        // Step 1: Insert into operations
        await connection.query(
            `INSERT INTO operations (userId, operationId, amount, operationType, symbol, value) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, operationId, amount, 1, symbol, soldAtValue * amount]
        );

        await connection.query(
            `UPDATE userTokens SET tokenAmount = tokenAmount - ? WHERE userId = ? AND tokenSymbol = ?`,
            [amount, userId, symbol]
        );

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
