const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '103.207.1.91',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  database: process.env.DB_NAME || 'CSE9909',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Use true if using Azure/SSL
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false', // true for self-signed or direct IP
    enableArithAbort: true,
    connectTimeout: 15000,
    requestTimeout: 15000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;
let isConnecting = false;

/**
 * Returns an active MSSQL connection pool
 */
async function getPool() {
  if (pool && pool.connected) {
    return pool;
  }

  if (isConnecting) {
    // Wait until current attempt completes
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    if (pool && pool.connected) return pool;
  }

  isConnecting = true;
  try {
    if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
      console.warn('⚠️  DB_USER or DB_PASSWORD not set in environment. Database connection will be deferred.');
      isConnecting = false;
      return null;
    }

    console.log(`Connecting to SQL Server [${config.server}:${config.port}/${config.database}]...`);
    pool = await new sql.ConnectionPool(config).connect();
    console.log('✅ Connected to SQL Server successfully.');
    isConnecting = false;
    return pool;
  } catch (err) {
    isConnecting = false;
    console.error('❌ SQL Server connection error:', err.message);
    throw err;
  }
}

/**
 * Executes a parameterized SQL query safely
 * @param {string} queryString
 * @param {Array<{name: string, type: sql.ISqlType, value: any}>} params
 */
async function executeQuery(queryString, params = []) {
  const p = await getPool();
  if (!p) {
    throw new Error('Database connection is not configured or unavailable.');
  }

  const request = p.request();
  for (const param of params) {
    if (param.type) {
      request.input(param.name, param.type, param.value);
    } else {
      request.input(param.name, param.value);
    }
  }

  return await request.query(queryString);
}

/**
 * Check database health
 */
async function checkHealth() {
  try {
    const p = await getPool();
    if (!p) {
      return { status: 'unconfigured', message: 'Database credentials not provided in .env' };
    }
    const result = await p.request().query('SELECT 1 AS healthy, GETUTCDATE() AS server_time');
    return {
      status: 'connected',
      server: config.server,
      database: config.database,
      serverTime: result.recordset[0]?.server_time,
    };
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
      server: config.server,
      database: config.database,
    };
  }
}

module.exports = {
  sql,
  getPool,
  executeQuery,
  checkHealth,
  config,
};
