import { getOrCreateOperationFile } from "./createOperationsFile.js";
import { appendTradeOperation } from "./appendTradeOperation.js";
import { drive } from "../storage/drive.js";
import dayjs from "dayjs";
const folderId = process.env.GOOGLE_DRIVE_REGISTRY_FOLDER

function formatOperationText(data) {
  return `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]|${data.CUIT}|${data.operationType ? 1 === 'C' : 'V' }|${data.token}|${data.amount}|$${Number(data.price).toFixed(2)};`;//format the output to the file
}

export async function logTradeOperation(operationData) {
  const fileId = await getOrCreateOperationFile(drive, folderId);
  const formatted = formatOperationText(operationData);
  await appendTradeOperation(drive, fileId, formatted);
}