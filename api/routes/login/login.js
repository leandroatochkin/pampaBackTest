import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../../db/db.js'; // Adjust the path as necessary

const router = express.Router();


// Secret key for JWT
const JWT_SECRET =  process.env.JWT_SECRET

// POST /api/login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Username and password are required.' });

  const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  console.log(result)
  
  if(result[0].length === 0){
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (email !== result[0][0].email || password !== result[0][0].password)
    return res.status(401).json({ error: 'Invalid credentials' });

  // Create token
  const token = jwt.sign({ id: result[0][0].id }, JWT_SECRET, {
    expiresIn: '6h',
  });

  //res.json({ token });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 86400000 // 1 day
  })
});

export default router;
