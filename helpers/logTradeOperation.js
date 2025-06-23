import { getOrCreateOperationFile } from "./createOperationsFile.js";
import { appendTradeOperation } from "./appendTradeOperation.js";
import { drive } from "../storage/drive.js";
import dayjs from "dayjs";
const folderId = process.env.GOOGLE_DRIVE_REGISTRY_FOLDER

function formatOperationText(data) {
  return `${data.CUIT}|${data.operationType === 0 ? 'C' : 'V' }|${(data.token).padEnd(30)}|${(String(data.amount)).padEnd(10)}|${(String(Number(data.price/100).toFixed(2))).padEnd(10)|('100.50').padEnd(10)};`;//format the output to the file
}

export async function logTradeOperation(operationData) {
  const fileId = await getOrCreateOperationFile(drive, folderId);
  const formatted = formatOperationText(operationData);
  await appendTradeOperation(drive, fileId, formatted);
} 