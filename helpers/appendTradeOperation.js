import { supabase } from "../storage/supabaseUploader.js";

export async function appendTradeOperation(bucket, filePath, operationText) {
  // Download existing file content
  let existing = '';

  const { data: existingFile, error: downloadErr } = await supabase
    .storage
    .from(bucket)
    .download(filePath);

  if (existingFile && !downloadErr) {
    const text = await existingFile.text();
    existing = text;
  }

  const updated = existing + '\n' + operationText;

  const { error: uploadErr } = await supabase
    .storage
    .from(bucket)
    .upload(filePath, new Blob([updated]), {
      contentType: 'text/plain',
      upsert: true,
    });

  if (uploadErr) {
    throw new Error('Failed to upload updated file: ' + uploadErr.message);
  }
}

