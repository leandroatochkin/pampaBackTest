import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db/db.js';
import { uploadToDrive } from '../../../storage/googleDriveApi.js';
import os from 'os';
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';
import { transporter } from '../../mailing/transport.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Example: 5MB file size limit
});

// Middleware to handle Multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      error: 'File upload error', 
      message: err.message 
    });
  } else if (err) {
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error', 
      message: err.message 
    });
  }
  next();
};

router.post(
  '/',
  upload.fields([
    { name: 'frontIdImage', maxCount: 1 },
    { name: 'backIdImage', maxCount: 1 },
   { name: 'selfieImage', maxCount: 1 }
  ]),



  
  handleMulterErrors, 
  async (req, res) => {
    try {
      console.log('Request received. Checking for user data...');
      if (!req.body.user) {
        return res.status(400).json({ 
          success: false, 
          error: "MISSING_USER_DATA" 
        });
      }
      const user = JSON.parse(req.body.user);
      const email = user.email;


      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'EMAIL_ALREADY_EXISTS',
          message: `Duplicate entry. Email ${email} is already registered.`,
        });
      }


      
      const hashedPassword = await bcrypt.hash(user.password, 10)
 
       console.log('Inserting user into database...');
        const userId = uuidv4()
        const emailVerificationToken = uuidv4();
        const query = `
        INSERT INTO users (
              id, email, password, firstName, lastName, middleName, maritalStatus, phoneNumber,
              country, province, city, postalCode, address, CUIT, bank, CBU,
              politicallyExposed, UIFRequired, fiscalResident_outside_argentina,
              termsAndConditions_read, isVerified, accountNumber, workingCode, emailVerified, emailVerificationToken
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            userId,
            user.email,
            hashedPassword,
            user.firstName.toLowerCase().trim(),
            user.lastName.toLowerCase().trim(),
            user.middleName.toLowerCase().trim() || null,
            user.maritalStatus || null,
            user.phoneNumber || null,
            user.country || null,
            user.province || null,
            user.city || null,
            user.postalCode || null,
            user.address || null,
            user.CUIT || null,
            user.bank || null,
            user.CBU || null,
            user.politicallyExposed || false,
            user.UIFRequired || false,
            user.fiscalResident_outside_argentina || false,
            user.termsAndConditions_read || false,
            'P',
            user.accountNumber || null, // Default to 0 if not provided
            user.workingCode || null,
            0,
            emailVerificationToken
          ];



      const [result] = await db.execute(query, values);

      if(result){
         await transporter.sendMail({
          from: '"PampaTokens" <soporte@pampatokens.com.ar>',
          to: user.email,
          subject: 'Verificá tu correo electrónico - NO CONTESTAR',
          html: `
            <h3>Confirmá tu cuenta</h3>
            <p>Hacé clic en el siguiente enlace para verificar tu correo:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}">Verificar cuenta</a>
          `,
       });
      }

      

      const userSummary = `${user.email.trim().padEnd(50)};${user.accountType};${user.lastName.trim().padEnd(50)};${user.firstName.trim().padEnd(50)};${user.middleName.trim().padEnd(50) || ('N/A').padEnd(50)};${user.postalCode.trim() || 'N/A'};${user.address.trim().padEnd(100) || ('N/A').padEnd(100)};${user.city.padEnd(50) || ('N/A').padEnd(50)};${user.province.padEnd(50) || ('N/A').padEnd(50)};${String(user.country).padStart(3) || ('NA').padStart(3)};${user.phoneNumber.trim().padEnd(20) || ('N/A').padEnd(20)};${user.CUIT.trim() || 'N/A'};${user.maritalStatus || 'N/A'};${user.workingCode};${user.UIFRequired ? 'SI' : 'NO'};${user.politicallyExposed ? 'SI' : 'NO'};${user.bank.trim().padEnd(50) || ('N/A').padEnd(50)};${user.CBU.trim().padEnd(30) || 'N/A'};${user.accountNumber.trim().padEnd(20) || ('N/A').padEnd(20)};${user.fiscalResident_outside_argentina ? 'SI' : 'NO'};`;

      const tempSummaryPath = path.join(os.tmpdir(), `Sumario-${user.CUIT}(${user.firstName}, ${user.firstName}).txt`);
      fs.writeFileSync(tempSummaryPath, userSummary);
      const { fileId: summaryFileId, publicUrl: summaryUrl } = await uploadToDrive(tempSummaryPath, `tk_dfma1-${user.lastName}-${user.firstName}-${user.CUIT}.txt`);
      fs.unlinkSync(tempSummaryPath);

      const uploadBufferToDrive = async (file, namePrefix) => {
        const translateNamePrefix = (namePrefix) => {
          switch(namePrefix){
            case 'frontIdImage':
              return 'DNI-FRENTE'
            case 'backIdImage':
              return 'DNI-DORSO'
            case 'selfieImage':
             return 'ROSTRO'
          }
        }


        const fileName = `${user.lastName}-${user.firstName}-${user.CUIT}${translateNamePrefix(namePrefix)}-${dayjs(Date.now()).format('DD-MM-YYYY')}-${file.originalname}`;
        const tempPath = path.join(os.tmpdir(), fileName);
        fs.writeFileSync(tempPath, file.buffer);
        
        const { fileId, publicUrl } = await uploadToDrive(tempPath, fileName,);
        
        fs.unlinkSync(tempPath);
        return { fileId, publicUrl };
      };

      const imageDriveIds = {};

      imageDriveIds['userSummary'] = { driveFileId: summaryFileId, publicUrl: summaryUrl };


      const filesToUpload = [
        {
          filePath: tempSummaryPath,  
          fileName: `Sumario-${user.CUIT}(${user.firstName}, ${user.lastName}).txt`, 
        },
      ];


      for (const fieldName of [
        'frontIdImage', 
        'backIdImage', 
        'selfieImage'
      ]) {
        if (req.files[fieldName]?.[0]) {
          console.log(`Processing ${fieldName}...`);
          const file = req.files[fieldName][0];
          const { fileId, publicUrl } = await uploadBufferToDrive(file, fieldName);
          imageDriveIds[fieldName] = { driveFileId: fileId, publicUrl };
          console.log('url:', publicUrl)
        }
      }


       console.log('Registration successful. Sending response.');
      return res.status(200).json({ 
        success: true,
        message: 'User created and files uploaded to Google Drive', 
        imageDriveIds 
      });

      
    } catch (err) {
      console.error('Error handling registration:', err);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request', 
        message: err.message 
      });
    }
  }
);

export default router;