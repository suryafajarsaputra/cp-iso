import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX = 5 * 1024 * 1024;

export async function GET() {
  const [rows] = await pool.query('SELECT * FROM gallery ORDER BY id DESC');
  return NextResponse.json(rows);
}

export async function POST(req) {
  try {
    const fd = await req.formData();
    const file = fd.get('file');
    const title = String(fd.get('title') || '').trim().slice(0, 150);
    const category = String(fd.get('category') || 'Umum').trim().slice(0, 60) || 'Umum';
    if (!title) return NextResponse.json({ error: 'Judul foto wajib diisi.' }, { status: 400 });
    if (!file || typeof file === 'string') return NextResponse.json({ error: 'Pilih file foto.' }, { status: 400 });
    const ext = EXT[file.type];
    if (!ext) return NextResponse.json({ error: 'Format harus JPG, PNG, WEBP, atau GIF.' }, { status: 400 });
    if (file.size > MAX) return NextResponse.json({ error: 'Ukuran foto maksimal 5 MB.' }, { status: 400 });

    const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    const dir = path.join(process.cwd(), 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    const [r] = await pool.query('INSERT INTO gallery (title,category,filename) VALUES (?,?,?)', [title, category, filename]);
    return NextResponse.json({ ok: true, id: r.insertId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal mengunggah foto.' }, { status: 500 });
  }
}
