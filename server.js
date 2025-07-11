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
import getUserRoute from './api/routes/user/getUser.js'
import forgotPasswordRoute from './api/routes/forgotPassword/forgotPassword.js'
import verifyEmailRoute from './api/routes/register/verifyEmail.js'
import deleteAccountRoute from './api/routes/user/deleteAccount.js'
import resetPasswordRoute from './api/routes/forgotPassword/resetPassword.js'
import logoutRoute from './api/routes/logout/logout.js'
import cookieParser from 'cookie-parser';



const app = express();

const FRONTEND_URL_A = process.env.FRONTEND_URL_A;
const FRONTEND_URL_B = process.env.FRONTEND_URL_B;


const allowedOrigins = [
    FRONTEND_URL_A,
    FRONTEND_URL_B
];
 
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
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

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
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
app.use('/user', getUserRoute)
app.use('/forgot-password', forgotPasswordRoute)
app.use('/verify-email', verifyEmailRoute)
app.use('/delete-account', deleteAccountRoute)
app.use('/reset-password', resetPasswordRoute)
app.use('/logout', logoutRoute)

//app.use(centralizedErrorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
