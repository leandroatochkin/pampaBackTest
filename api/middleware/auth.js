// import jwt from 'jsonwebtoken';
// const JWT_SECRET = process.env.JWT_SECRET;

// export function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader?.split(' ')[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user; // put user data on the request
//     next();
//   });
// }

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'No token found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // you can access req.user in your route
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};