
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import mime from 'mime-types';
import { drive, folderId } from './drive.js';

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
      supportsAllDrives: true 
    });
    
    console.log('📂 Folder contents:', response.data.files);
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
