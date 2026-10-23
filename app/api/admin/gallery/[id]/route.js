import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { pool } from '@/lib/db';

export async function PUT(req, { params }) {
  const b = await req.json().catch(() => ({}));
  const title = String(b.title || '').trim().slice(0, 150);
  const category = String(b.category || 'Umum').trim().slice(0, 60) || 'Umum';
  if (!title) return NextResponse.json({ error: 'Judul wajib diisi.' }, { status: 400 });
  await pool.query('UPDATE gallery SET title=?, category=? WHERE id=?', [title, category, params.id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  const [rows] = await pool.query('SELECT filename FROM gallery WHERE id=?', [params.id]);
  if (rows[0]) {
    await unlink(path.join(process.cwd(), 'uploads', rows[0].filename)).catch(() => {});
    await pool.query('DELETE FROM gallery WHERE id=?', [params.id]);
  }
  return NextResponse.json({ ok: true });
}
