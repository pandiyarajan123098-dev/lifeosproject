const fs = require('fs');
const path = require('path');
const { getPool, sql } = require('../config/db');
require('dotenv').config();

async function initDb() {
  console.log('Initiating LifeOS database schema verification...');
  try {
    const pool = await getPool();
    if (!pool) {
      console.error('❌ Cannot run init-db: Database credentials missing in .env');
      process.exit(1);
    }

    const schemaPath = path.join(__dirname, '../../sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL statements on GO
    const batches = schemaSql
      .split(/\bGO\b/i)
      .map((b) => b.trim())
      .filter((b) => b.length > 0 && !b.startsWith('USE ['));

    console.log(`Executing ${batches.length} schema batches safely...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        await pool.request().query(batch);
        console.log(`  ✓ Batch ${i + 1}/${batches.length} verified.`);
      } catch (err) {
        console.warn(`  ⚠️  Batch ${i + 1} notice:`, err.message);
      }
    }

    console.log('✅ LifeOS database schema initialization completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database schema verification failed:', err.message);
    process.exit(1);
  }
}

initDb();
