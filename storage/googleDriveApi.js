
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import mime from 'mime-types';
import { drive, folderId } from './drive.js';




(async () => {
  try {
    console.log('📥 Attempting to list folder contents...');
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name)',
      supportsAllDrives: true,
    });
    console.log('📂 Folder contents:', res.data.files);
  } catch (err) {
    console.error('❌ Listing failed:', err);
  }
})();



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
    
    const res = await drive.files.list({
  q: `'${folderId}' in parents`,
  fields: 'files(id, name)',
  supportsAllDrives: true,
});

console.log('📂 Folder contents:', res.data.files);
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
