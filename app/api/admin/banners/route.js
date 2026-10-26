import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { ensureTables } from '@/lib/siteContent';
import { saveImage } from '@/lib/upload';

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureTables();
  const [rows] = await pool.query('SELECT * FROM banners ORDER BY sort_order, id');
  return NextResponse.json(rows);
}

export async function POST(req) {
  try {
    await ensureTables();
    const fd = await req.formData();
    const filename = await saveImage(fd.get('file'));
    const title = String(fd.get('title') || '').trim().slice(0, 150);
    const caption = String(fd.get('caption') || '').trim().slice(0, 300);
    const link = String(fd.get('link') || '').trim().slice(0, 300);
    const [[m]] = await pool.query('SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM banners');
    await pool.query('INSERT INTO banners (title,caption,link,filename,sort_order) VALUES (?,?,?,?,?)', [title, caption, link, filename, m.n]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Gagal menambah banner.' }, { status: 400 });
  }
}
