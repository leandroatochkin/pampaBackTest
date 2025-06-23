import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    const result = await db.query("SELECT * FROM userTokens WHERE userId = '9b3ce2fb-8e46-46e9-b47d-38576ce19f93'");
    console.log(result);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
