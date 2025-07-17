import dotenv from 'dotenv';
dotenv.config();
import express from 'express';



const router = express.Router();


const ADMIN_PASSWORD =  process.env.ADMIN_PASSWORD

router.post('/', async (req, res) => {
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ error: 'password is required.' });


if (password !== ADMIN_PASSWORD) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

  res.status(200).json({ message: 'Logged in successfully' }) 
  return
});



export default router;
