import express from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';
import {db} from '../../db/db.js'; // Adjust the path as necessary
import { v4 as uuidv4 } from 'uuid';
//import { sendVerificationEmail } from '../../../mailing/mailingService.js';
import jwt from 'jsonwebtoken'


const router = express.Router();

// Set your desired upload folder (e.g., Desktop/uploads)
const desktopPath = path.join(os.homedir(), 'Desktop', 'uploads');

// Ensure the folder exists
fs.mkdirSync(desktopPath, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, desktopPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.post(
    '/',
    upload.fields([
      { name: 'frontIdImage', maxCount: 1 },
      { name: 'backIdImage', maxCount: 1 },
      { name: 'selfieImage', maxCount: 1 }
    ]),
    (req, res) => {
      try {
        const user = JSON.parse(req.body.user)
        const email = user.email
        const insertUser = async (user) => {
            const query = `
              INSERT INTO users (
                id, email, password, firstName, lastName, middleName, maritalStatus, phoneNumber,
                country, province, city, postalCcode, address, CUIT, bank, CBU,
                politicallyEexposed, UIFRequired, fiscalResident_outside_argentina,
                termsAndConditions_read, isVerified
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
          
            const values = [
              uuidv4(), // generate a UUID before calling this
              user.email,
              user.password,
              user.firstName,
              user.lastName,
              user.middleName || null,
              user.maritalStatus || null,
              user.phoneNumber || null,
              user.country || null,
              user.province || null,
              user.city || null,
              user.postalCcode || null,
              user.address || null,
              user.CUIT || null,
              user.bank || null,
              user.CBU || null,
              user.politicallyEexposed || false,
              user.UIFRequired || false,
              user.fiscalResident_outside_argentina || false,
              user.termsAndConditions_read || false,
              user.isVerified || false,
            ];
          
            db.query(query, values, (err, results) => {
              if (err) {
                console.error('Error inserting user:', err);
                return;
              }
              console.log('User inserted with ID:', user.id);

            });
          };
          
          insertUser(user);

          const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
          })
          
          // const sendEmail = async () => await sendVerificationEmail(email, token)
          // sendEmail()

         
        res.json({ message: 'Files and user data received successfully' });
      } catch (err) {
        console.error('Error parsing user JSON:', err);
        res.status(400).json({ error: 'Invalid user JSON' });
      }
    }
  );
  

export default router;