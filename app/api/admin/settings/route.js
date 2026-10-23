import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req) {
  try {
    const b = await req.json();
    if (b.email && !/^\S+@\S+\.\S+$/.test(b.email))
      return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 });
    if (b.maps_url && !/^https?:\/\//i.test(b.maps_url))
      return NextResponse.json({ error: 'Link peta harus diawali http:// atau https://' }, { status: 400 });
    await saveSettings(b);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan.' }, { status: 500 });
  }
}
