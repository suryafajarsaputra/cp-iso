import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PATCH(req, { params }) {
  const { is_read } = await req.json().catch(() => ({}));
  await pool.query('UPDATE contacts SET is_read=? WHERE id=?', [is_read ? 1 : 0, params.id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  await pool.query('DELETE FROM contacts WHERE id=?', [params.id]);
  return NextResponse.json({ ok: true });
}
