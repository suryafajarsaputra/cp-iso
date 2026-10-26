import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { pool } from '@/lib/db';

export async function PUT(req, { params }) {
  const b = await req.json().catch(() => ({}));
  const sets = [], vals = [];
  if ('title' in b) { sets.push('title=?'); vals.push(String(b.title).slice(0, 150)); }
  if ('caption' in b) { sets.push('caption=?'); vals.push(String(b.caption).slice(0, 300)); }
  if ('link' in b) { sets.push('link=?'); vals.push(String(b.link).slice(0, 300)); }
  if ('active' in b) { sets.push('active=?'); vals.push(b.active ? 1 : 0); }
  if ('sort_order' in b) { sets.push('sort_order=?'); vals.push(parseInt(b.sort_order) || 0); }
  if (sets.length) await pool.query(`UPDATE banners SET ${sets.join(',')} WHERE id=?`, [...vals, params.id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  const [rows] = await pool.query('SELECT filename FROM banners WHERE id=?', [params.id]);
  if (rows[0]) {
    await unlink(path.join(process.cwd(), 'uploads', rows[0].filename)).catch(() => {});
    await pool.query('DELETE FROM banners WHERE id=?', [params.id]);
  }
  return NextResponse.json({ ok: true });
}
