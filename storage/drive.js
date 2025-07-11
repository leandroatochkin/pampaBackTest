import { google } from "googleapis";

const keyFilePath = '/etc/secrets/pampatokensstorage-d1e00b34af25.json';
//const keyFilePath = '../pampabacktest/secrets/pampatokensstorage-d1e00b34af25.json';

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

export const drive = google.drive({ version: 'v3', auth });