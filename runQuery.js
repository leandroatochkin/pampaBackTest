import { db } from "./api/db/db.js";

async function testConnection() {
  try {
    await db.query('ALTER TABLE users CHANGE bankAccountType accountNumber VARCHAR(20)');
    console.log('done');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    db.end();
  }
}

testConnection();
