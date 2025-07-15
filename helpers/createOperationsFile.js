// import { getCurrentOperationLogDate } from "./timeCutOffs.js";
// //check if file already exists, if not create one
// export async function getOrCreateOperationFile(drive, folderId) {
//   const fileName = `TK_COVE_${getCurrentOperationLogDate()}.txt`;//modify file name here

//   const res = await drive.files.list({
//     q: `'${folderId}' in parents and name='${fileName}' and trashed=false`,
//     fields: 'files(id, name)',
//     spaces: 'drive'
//   });

//   if (res.data.files.length > 0) {
//     return res.data.files[0].id;
//   }

//   const file = await drive.files.create({
//     resource: {
//       name: fileName,
//       parents: [folderId],
//       mimeType: 'text/plain'
//     },
//     media: {
//       mimeType: 'text/plain',
//       body: ''
//     },
//     fields: 'id'
//   });

//   return file.data.id;
// }

import { supabase } from "../storage/supabaseUploader.js";
import { getCurrentOperationLogDate } from "./timeCutOffs.js";

export async function getOrCreateOperationFile(bucket, folder) {
  const fileName = `TK_COVE_${getCurrentOperationLogDate()}.txt`;
  const fullPath = `${folder}/${fileName}`;

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

