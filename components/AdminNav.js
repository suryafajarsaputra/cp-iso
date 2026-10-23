'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const p = usePathname();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/adsmins/login';
  }
  const item = (href, label) => (
    <Link href={href} className={p.startsWith(href) ? 'on' : ''}>{label}</Link>
  );
  return (
    <aside className="adm-side">
      <img src="/logo-clear.png" alt="ISO" />
      <nav>
        {item('/adsmins/gallery', 'Galeri foto')}
        {item('/adsmins/contacts', 'Pesan masuk')}
        {item('/adsmins/settings', 'Info kontak')}
        <a href="/" target="_blank" rel="noreferrer">Lihat website</a>
      </nav>
      <button onClick={logout}>Keluar</button>
    </aside>
  );
}
