import { readFile } from 'fs/promises';
import path from 'path';

const types = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };

export async function GET(_req, { params }) {
  const name = params.name;
  const m = /^[a-f0-9]{32}\.(jpg|png|webp|gif)$/.exec(name);
  if (!m) return new Response('Not found', { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), 'uploads', name));
    return new Response(buf, { headers: { 'Content-Type': types[m[1]], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
