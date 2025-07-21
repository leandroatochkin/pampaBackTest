import { supabase } from "../storage/supabaseUploader.js";
import { getCurrentOperationLogDate } from "./timeCutOffs.js";

export async function getOrCreateOperationFile(bucket) {
  //const fileName = `TK_COVE_${getCurrentOperationLogDate()}.txt`;
  const fileName = `TK_COVE1.txt`;
  const fullPath = `${fileName}`;

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .download(fullPath);

  // if file exists, return its path
  if (data && !error) {
    return { exists: true, fullPath };
  }

  // if file doesn't exist, create it empty
  const { error: uploadErr } = await supabase
    .storage
    .from(bucket)
    .upload(fullPath, new Blob(['']), {
      contentType: 'text/plain',
      upsert: false,
    });

  if (uploadErr) {
    throw new Error('Failed to create new operation file: ' + uploadErr.message);
  }

  return { exists: false, fullPath };
}

