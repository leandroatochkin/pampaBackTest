import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import registerUser from './api/routes/register/register.js'
import loginUser from './api/routes/login/login.js'
import getPortfolio from './api/routes/operations/getPortfolio.js'
import upload from './api/routes/token/upload.js'
import getToken from './api/routes/token/getToken.js'
import buyToken from './api/routes/token/buyToken.js'
import sellToken from './api/routes/token/sellToken.js'
import getMovements from './api/routes/movements/getMovements.js'
import verifyRoute from './api/routes/register/verify.js'
import checkAuth from './api/routes/login/checkAuth.js'
import cookieParser from 'cookie-parser';


const app = express();

const frontendURL = process.env.FRONTEND_URL;

const allowedOrigins = [
    frontendURL,
];
 
app.use(cors({
  origin: frontendURL,  
  credentials: true                 
}))
app.use(express.json());
app.use(cookieParser()); 

app.options('/', cors()); // Handle preflight requests for all routes

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/debug-cookies', (req, res) => {
  res.send(req.headers.cookie || 'No cookies received');
});


// Load routes
app.use('/register', registerUser)
app.use('/login', loginUser)
app.use('/get-portfolio', getPortfolio)
app.use('/token', upload)
app.use('/get-value', getToken)
app.use('/buy', buyToken)
app.use('/sell', sellToken)
app.use('/movements', getMovements)
app.use('/auth', checkAuth)
app.use('/verify', verifyRoute)

//app.use(centralizedErrorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
