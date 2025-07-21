// supabaseUploader.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

export const supabase = createClient(process.env.SUPABASE_BUCKET_URL, process.env.SUPABASE_ROLE_KEY);
const bucket = process.env.SUPABASE_BUCKET_NAME;

export const uploadToSupabase = async (filePath, destPath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage.from(bucket).upload(destPath, fileBuffer, {
    contentType: 'application/octet-stream', // change to mime.lookup(...) if needed
    upsert: true
  });

  if (error) {
    console.error('❌ Upload error:', error.message);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(destPath);

  return {
    url: publicUrlData.publicUrl,
    path: data.path
  };
};

export const downloadFromSupabase = async (filePath, localPath) => {
  const { data, error } = await supabase.storage.from(bucket).download(filePath);

  if (error) {
    if (error.statusCode === 404) {
      return false; // File doesn't exist — totally fine
    }
    console.error('❌ Download error:', error.message);
    throw error;
  }

  const buffer = await data.arrayBuffer();
  fs.writeFileSync(localPath, Buffer.from(buffer));
  return true;
};