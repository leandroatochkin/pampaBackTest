import { google } from "googleapis";

const keyFilePath = '/etc/secrets/pampatokens-32095e817f7a.json';
//const keyFilePath = '../pampabacktest/secrets/pampatokensstorage-d1e00b34af25.json';
const key = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
console.log('✅ Using service account:', key.client_email);

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
console.log('📁 Uploading to folder ID:', folderId);

export const drive = google.drive({ version: 'v3', auth });