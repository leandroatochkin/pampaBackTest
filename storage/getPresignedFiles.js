import express from 'express';
import { supabase } from './supabaseUploader.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .list('', {  // root folder
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
      recursive: true, // ✅ includes files inside folders
    });

  if (error) {
    console.error('Failed to list files:', error);
    return res.status(500).json({ success: false, message: 'Could not list files' });
  }

  return res.status(200).json({ success: true, files: data });
});

export default router;
