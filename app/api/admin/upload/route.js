import { NextResponse } from 'next/server';
import { saveImage } from '@/lib/upload';

export async function POST(req) {
  try {
    const fd = await req.formData();
    return NextResponse.json({ filename: await saveImage(fd.get('file')) });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Gagal mengunggah.' }, { status: 400 });
  }
}
