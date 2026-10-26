import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getContent());
}

export async function PUT(req) {
  try {
    await saveContent(await req.json());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal menyimpan konten.' }, { status: 500 });
  }
}
