import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { db } from '../../db/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Missing fields.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE resetToken = ?', [token]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute('UPDATE users SET password = ?, resetToken = NULL WHERE resetToken = ?', [hashedPassword, token]);

    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
