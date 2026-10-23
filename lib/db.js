import mysql from 'mysql2/promise';

const g = globalThis;
export const pool =
  g._isoPool ??
  (g._isoPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iso_company',
    waitForConnections: true,
    connectionLimit: 10,
  }));
