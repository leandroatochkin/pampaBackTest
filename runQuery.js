import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    await db.query('ALTER TABLE users MODIFY country VARCHAR(3) NOT NULL');
    console.log('done');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
