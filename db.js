const sql = require('mssql');

const config = {
  user: process.env.SQL_ANMOL_DB_USER, // SQL DB User Value
  password: process.env.SQL_ANMOL_DB_PASSWORD, // SQL DB Password password
  server: process.env.SQL_ANMOL_DB_SERVER, // SQL DB Server nameyour-server.database.windows.net
  database: process.env.SQL_ANMOL_DB_NAME, // SQL DB Name
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to Azure SQL (Private)');
    return pool;
  })
  .catch(err => {
    console.error('Azure SQL connection failed:', err);
    throw err; // THIS LINE FIXES EVERYTHING
  });

module.exports = { sql, poolPromise };
