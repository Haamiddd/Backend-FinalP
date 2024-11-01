const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Log environment variables to check if they are loaded correctly
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : '(empty)');
console.log('DB_NAME:', process.env.DB_NAME);

// Create a pool of connections to the MySQL database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '', // Use empty string if password is not provided
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Maximum number of connections in the pool
  queueLimit: 0         // No limit for queued connection requests
});

// Export the connection pool
module.exports = db;
