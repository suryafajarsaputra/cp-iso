require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const user = process.env.ADMIN_USER || 'admin';
  const pass = process.env.ADMIN_PASS || 'admin12345';
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iso_company',
  });
  const hash = await bcrypt.hash(pass, 10);
  await db.query(
    'INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
    [user, hash]
  );
  console.log(`Admin siap -> username: ${user} | password: ${pass}`);
  await db.end();
})().catch((e) => { console.error('Gagal:', e.message); process.exit(1); });
