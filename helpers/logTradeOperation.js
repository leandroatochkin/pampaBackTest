import { getOrCreateOperationFile } from './createOperationsFile.js'
import { appendTradeOperation } from "./appendTradeOperation.js";
import dayjs from "dayjs";

const BUCKET = 'pampatokensstorage';


function formatOperationText(data) {
  return `${String(data.DNI).padStart(11, '0')}|${dayjs().format('YYYYMMDD')}|${dayjs().format('HHmmss')}|${data.operationType === 0 ? 'C' : 'V'}|${String(data.tokenCode).padStart(3, '0')}|${String(data.tokenName).padEnd(30)}|${String(data.amount).slice(0, 10).padStart(10, '0')}|${(String(Number(data.price / 100))).padStart(12, '0')}|${('10050').padStart(12, '0')};`;
}

export async function logTradeOperation(operationData) {
  const { fullPath } = await getOrCreateOperationFile(BUCKET);
  const formatted = formatOperationText(operationData);
  await appendTradeOperation(BUCKET, fullPath, formatted);
}