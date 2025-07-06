import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../../db/db.js'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';

const router = express.Router();


// Secret key for JWT
const JWT_SECRET =  process.env.JWT_SECRET
const BACKEND_HOST = process.env.BACKEND_HOST

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

  const hashedPassword = result[0][0].password;

  const passwordMatch = await bcrypt.compare(password, hashedPassword);

if (!passwordMatch) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

  // Create token
  const token = jwt.sign(
  {
    id: result[0][0].id,
    email: result[0][0].email,
    isVerified: result[0][0].isVerified,
    firstName: result[0][0].firstName,
    lastName: result[0][0].lastName,
    emailVerified:  result[0][0].emailVerified,
  },
  JWT_SECRET,
  { expiresIn: '6h' }
);

  res.json({ token });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None', 
    maxAge: 86400000, // 1 day
    domain: `${BACKEND_HOST}`
  })

// res.cookie('token', token, {
//   httpOnly: true,
//   secure: false,        // must be false for HTTP
//   sameSite: 'Lax',      // or 'Strict' if you want more isolation
//   maxAge: 86400000      // 1 day
// })
  res.status(200).json({ message: 'Logged in successfully' }) 

});



export default router;
