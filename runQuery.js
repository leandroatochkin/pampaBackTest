import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    const result = await db.query("UPDATE users SET isVerified = 'A' WHERE lastName = 'costa esquivel'");
    console.log(result[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
