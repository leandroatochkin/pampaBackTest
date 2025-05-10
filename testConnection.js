import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT NOW()');
    console.log('✅ Connected! Server time:', rows[0]['NOW()']);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
