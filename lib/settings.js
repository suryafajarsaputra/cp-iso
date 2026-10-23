import { pool } from '@/lib/db';
import { company } from '@/lib/content';

export const FIELDS = ['email', 'phone', 'hours', 'address', 'maps_url'];

const defaults = () => ({
  email: company.email,
  phone: company.phone,
  hours: company.hours,
  address: company.address,
  maps_url: '',
});

async function ensure() {
  await pool.query('CREATE TABLE IF NOT EXISTS site_settings (k VARCHAR(50) PRIMARY KEY, v TEXT NOT NULL)');
}

export async function getSettings() {
  const d = defaults();
  try {
    await ensure();
    const [rows] = await pool.query('SELECT k, v FROM site_settings');
    for (const r of rows) if (FIELDS.includes(r.k)) d[r.k] = r.v;
  } catch {}
  return d;
}

export async function saveSettings(obj) {
  await ensure();
  for (const k of FIELDS) {
    if (k in obj) {
      await pool.query(
        'INSERT INTO site_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)',
        [k, String(obj[k] ?? '').trim().slice(0, 500)]
      );
    }
  }
}
