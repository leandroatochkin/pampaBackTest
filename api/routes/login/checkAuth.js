import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();


// Secret key for JWT
const JWT_SECRET =  process.env.JWT_SECRET

// POST /api/login
router.get('/', (req, res) => {
  const token = req.cookies.token
  console.log('Cookies:', req.cookies)
  if (!token) return res.status(401).json({ message: 'Not logged in' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ isAuthenticated: true, userId: decoded.id, userFirstName: decoded.firstName, userLastName: decoded.lastName, userEmail: decoded.email, isVerified: decoded.isVerified, emailVerified: decoded.emailVerified })
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router;