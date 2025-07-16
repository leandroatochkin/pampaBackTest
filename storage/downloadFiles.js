import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { supabase } from './supabaseUploader.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET_NAME; 
    const {filePath} = req.query

      if (!filePath) {
      return res.status(400).json({ success: false, error: 'Missing path query param' });
    }


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

    res.send(data)

  } catch (err) {
    console.error('❌ Error downloading file:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
