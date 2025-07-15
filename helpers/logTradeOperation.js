// import { getOrCreateOperationFile } from "./createOperationsFile.js";
// import { appendTradeOperation } from "./appendTradeOperation.js";
// import { drive } from "../storage/drive.js";
// import dayjs from "dayjs";
// const folderId = process.env.GOOGLE_DRIVE_REGISTRY_FOLDER

// function formatOperationText(data) {
//   return `${data.CUIT}|${dayjs().format('YYYYMMDD')}|${dayjs().format('HHmmss')}|${data.operationType === 0 ? 'C' : 'V' }|${String(data.tokenCode).padStart(3, '0')}|${String(data.tokenName).padEnd(30)}|${String(data.amount).slice(0, 10).padEnd(10, ' ')}|${(String(Number(data.price/100).toFixed(2))).padEnd(12)}|${('100.50').padEnd(12)};`;//format the output to the file
// }

// export async function logTradeOperation(operationData) {
//   const fileId = await getOrCreateOperationFile(drive, folderId);
//   const formatted = formatOperationText(operationData);
//   await appendTradeOperation(drive, fileId, formatted);
// } 

import { getOrCreateOperationFile } from './createOperationsFile.js'
import { appendTradeOperation } from "./appendTradeOperation.js";
import dayjs from "dayjs";

const BUCKET = 'pampatokensstorage';


function formatOperationText(data) {
  return `${data.CUIT}|${dayjs().format('YYYYMMDD')}|${dayjs().format('HHmmss')}|${data.operationType === 0 ? 'C' : 'V'}|${String(data.tokenCode).padStart(3, '0')}|${String(data.tokenName).padEnd(30)}|${String(data.amount).slice(0, 10).padEnd(10, ' ')}|${(String(Number(data.price / 100).toFixed(2))).padEnd(12)}|${('100.50').padEnd(12)};`;
}

export async function logTradeOperation(operationData) {
  const { fullPath } = await getOrCreateOperationFile(BUCKET);
  const formatted = formatOperationText(operationData);
  await appendTradeOperation(BUCKET, fullPath, formatted);
}