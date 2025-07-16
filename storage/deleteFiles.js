import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { supabase } from './supabaseUploader.js';

const router = express.Router();


router.delete('/', async (req, res) => {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ success: false, message: 'Missing file path' });
  }

  const { error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET_NAME) // ← replace with your bucket name
    .remove([path]);

  if (error) {
    console.error('❌ Delete error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete file' });
  }

  return res.status(200).json({ success: true, message: 'File deleted successfully' });
});

export default router;