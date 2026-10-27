import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export async function saveImage(file) {
  if (!file || typeof file === 'string') throw new Error('Pilih file foto.');
  const ext = EXT[file.type];
  if (!ext) throw new Error('Format harus JPG, PNG, WEBP, atau GIF.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran foto maksimal 5 MB.');
  const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
  const dir = path.join(process.cwd(), 'uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return filename;
}
