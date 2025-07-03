// routes/logout.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const BACKEND_HOST = process.env.BACKEND_HOST

const router = express.Router();

router.post('/', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    domain: `${BACKEND_HOST}`, // make sure this matches how it was set
    path: '/'
  });
  return res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
