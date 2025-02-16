import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Fallback to localhost if missing
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306, // Ensure port is a number
});
