
import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const keyFilePath = '/etc/secrets/pampatokensstorage-d1e00b34af25.json';

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

const drive = google.drive({ version: 'v3', auth });

export const uploadToDrive = async (filePath, fileName) => {
  try {
     const fileMetadata = {
      name: fileName,
      parents: [folderId],  // Specify the folder ID here
    };
    const media = {
      mimeType: mime.lookup(filePath) || 'application/octet-stream',
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    const fileId = response.data.id;

    // Set file to public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const publicUrl = `https://drive.google.com/uc?id=${fileId}`;

    return { fileId, publicUrl };
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    throw error;
  }
};
