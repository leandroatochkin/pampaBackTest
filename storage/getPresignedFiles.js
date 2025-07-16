import express from 'express';
import { supabase } from './supabaseUploader';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_BUCKET_URL,
  process.env.SUPABASE_ROLE_KEY 
);

router.get('/', async (req, res) => {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ success: false, message: 'Missing file path' });
  }

  const { data, error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET_NAME) // replace with your bucket
    .createSignedUrl(path, 60); // valid for 60 seconds

  if (error) {
    console.error('Signed URL error:', error);
    return res.status(500).json({ success: false, message: 'Could not generate signed URL' });
  }

  return res.status(200).json({ success: true, url: data.signedUrl });
});

export default router;
