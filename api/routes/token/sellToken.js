import express from 'express';
import { db } from '../../db/db.js';
import { authenticateToken } from '../../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { logTradeOperation } from '../../../helpers/logTradeOperation.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone); 


const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { userId, amount, symbol, soldAtValue, tokenName } = req.body;

        const nowInBuenosAires = dayjs().tz('America/Argentina/Buenos_Aires');
        const hour = nowInBuenosAires.hour();
        
        if (hour >= 23) {
            return res.status(403).json({ 
                message: 'Mercado cerrado. No puede vender luego de las 18:00hs (Buenos Aires time).' 
            });
        }

    if (!userId || amount == null || !symbol) {
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

          const getDNIresults = await connection.query(
                    `SELECT identificationNumber FROM users WHERE id = ?`,
                    [userId]
                )

        const getComissionResults = await connection.query(
                    `SELECT COMISION FROM pampaTokensVariations WHERE CODIGO_SIMBOLO = ?`,
                    [symbol]
                )
                
                const tokenComission = getComissionResults[0][0].COMISION
                const userDNI = getDNIresults[0][0].identificationNumber
                const operationDTO = {
                    DNI: userDNI,
                    operationType: 1,
                    tokenCode: symbol,
                    tokenName: tokenName,
                    amount: amount,
                    price: soldAtValue,
                    comission: tokenComission
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
