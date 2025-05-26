import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    await db.query('ALTER TABLE users RENAME COLUMN politicallyEexposed TO politicallyExposed');
    console.log('done');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
