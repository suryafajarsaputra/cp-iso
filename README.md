# ISO Company Profile (Next.js + MySQL)

## Cara menjalankan
1. Pastikan Node.js 18+ dan MySQL sudah aktif.
2. Import database:  `mysql -u root -p < database/schema.sql`  (atau import `database/schema.sql` lewat phpMyAdmin)
3. Edit `.env.local` (user/password MySQL, JWT_SECRET, ADMIN_USER, ADMIN_PASS).
4. `npm install`
5. `npm run seed`   -> membuat akun admin
6. `npm run dev`    -> buka http://localhost:3000

## Admin
- URL: http://localhost:3000/adsmins
- Login default: admin / admin12345 (ubah di `.env.local`, lalu jalankan `npm run seed` lagi)
- Galeri foto: tambah, edit judul/kategori, hapus
- Pesan masuk: lihat siapa yang mengisi Contact Us, tandai dibaca, hapus

## Ubah teks website
Edit `lib/content.js` (nama perusahaan, kontak, layanan, statistik).
Foto yang diunggah disimpan di folder `uploads/`.

## Production
`npm run build && npm start` (set COOKIE_SECURE=true jika memakai HTTPS)
