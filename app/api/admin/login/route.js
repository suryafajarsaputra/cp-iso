import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json().catch(() => ({}));
    if (!username || !password) return NextResponse.json({ error: 'Isi username dan password.' }, { status: 400 });
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
    const a = rows[0];
    if (!a || !(await bcrypt.compare(password, a.password_hash)))
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_token', await signToken({ id: a.id, u: a.username }), {
      httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true', path: '/', maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Tidak bisa terhubung ke database. Periksa .env.local.' }, { status: 500 });
  }
}
