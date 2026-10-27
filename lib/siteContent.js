import { pool } from '@/lib/db';
import { defaultContent } from '@/lib/content';
import { clean } from '@/lib/clean';

let ready;
export function ensureTables() {
  if (!ready) {
    ready = (async () => {
      await pool.query('CREATE TABLE IF NOT EXISTS site_settings (k VARCHAR(50) PRIMARY KEY, v MEDIUMTEXT NOT NULL)');
      await pool.query(`CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL DEFAULT '',
        caption VARCHAR(300) NOT NULL DEFAULT '',
        link VARCHAR(300) NOT NULL DEFAULT '',
        filename VARCHAR(100) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    })().catch((e) => { ready = null; throw e; });
  }
  return ready;
}

export async function getContent() {
  const base = structuredClone(defaultContent);
  try {
    await ensureTables();
    const [rows] = await pool.query('SELECT k, v FROM site_settings');
    let saved = null;
    for (const r of rows) {
      if (r.k === 'content') { try { saved = JSON.parse(r.v); } catch {} }
      else if (['email', 'phone', 'hours', 'address', 'maps_url'].includes(r.k)) base.contact[r.k] = r.v; // data lama
    }
    return clean(saved, base);
  } catch {
    return base;
  }
}

export async function saveContent(input) {
  await ensureTables();
  const c = clean(input, defaultContent);
  await pool.query('INSERT INTO site_settings (k, v) VALUES ("content", ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [JSON.stringify(c)]);
  return c;
}
