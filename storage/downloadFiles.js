import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { supabase } from './supabaseUploader.js';

const router = express.Router();

router.get('/:path(*)', async (req, res) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET_NAME; 
    const filePath = req.params.path; 

    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(filePath);

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
    res.setHeader('Content-Type', data.type);

    data.pipe(res); // Stream the file to the client

  } catch (err) {
    console.error('❌ Error downloading file:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
