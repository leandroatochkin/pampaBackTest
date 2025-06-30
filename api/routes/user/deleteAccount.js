import express from 'express';
import { db } from '../../db/db.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

router.delete('/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    if (userId !== id) {
        return res.status(403).json({ message: 'Unauthorized to delete this account' });
    }

    try {
        const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Account deleted' });
    } catch (err) {
        console.error('Transaction failed:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
