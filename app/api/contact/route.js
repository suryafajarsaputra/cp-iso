import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req) {
  try {
    const b = await req.json();
    if (b.website) return NextResponse.json({ ok: true }); // honeypot
    const name = String(b.name || '').trim().slice(0, 100);
    const email = String(b.email || '').trim().slice(0, 150);
    const phone = String(b.phone || '').trim().slice(0, 30);
    const subject = String(b.subject || '').trim().slice(0, 150);
    const message = String(b.message || '').trim().slice(0, 3000);
    if (!name || !message || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: 'Nama, email yang valid, dan pesan wajib diisi.' }, { status: 400 });
    await pool.query('INSERT INTO contacts (name,email,phone,subject,message) VALUES (?,?,?,?,?)', [name, email, phone, subject, message]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Pesan belum terkirim. Coba lagi sebentar lagi.' }, { status: 500 });
  }
}
