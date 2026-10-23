import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [rows] = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
  return NextResponse.json(rows);
}
