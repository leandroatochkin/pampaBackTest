import express from 'express';
import { db } from '../../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE emailVerificationToken = ?', [token]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or expired token.' });
    }

    await db.execute(
      'UPDATE users SET emailVerified = ?, emailVerificationToken = NULL WHERE id = ?',
      [1, user.id]
    );

    return res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;
