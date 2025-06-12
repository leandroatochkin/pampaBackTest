import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    await db.query('ALTER TABLE users ADD COLUMN workingCode INT');
    console.log('done');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
