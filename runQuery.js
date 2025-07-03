import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = 'shredartist@gmail.com'");
    console.log(result[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
