'use client';
import { useEffect, useState } from 'react';

export default function SettingsAdmin() {
  const [f, setF] = useState(null);
  const [msg, setMsg] = useState({ t: '', ok: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setF);
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true); setMsg({ t: '', ok: true });
    const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    setBusy(false);
    setMsg(r.ok ? { t: 'Pengaturan disimpan dan sudah tampil di website.', ok: true } : { t: j.error, ok: false });
  }

  if (!f) return <p className="empty">Memuat...</p>;

  return (
    <>
      <h1>Info kontak website</h1>
      <form className="adm-card form" onSubmit={save}>
        <div className="row2">
          <label>Email<input value={f.email} onChange={set('email')} type="email" /></label>
          <label>Nomor telepon / WhatsApp<input value={f.phone} onChange={set('phone')} /></label>
        </div>
        <label>Jam buka<input value={f.hours} onChange={set('hours')} placeholder="Senin – Jumat, 08.00 – 17.00 WIB" /></label>
        <label>Alamat lokasi<textarea rows={3} value={f.address} onChange={set('address')} /></label>
        <label>Link Google Maps (opsional)<input value={f.maps_url} onChange={set('maps_url')} placeholder="https://maps.app.goo.gl/..." /></label>
        <button className="btn" disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan perubahan'}</button>
        {msg.t && <p className={msg.ok ? 'note ok' : 'note err'}>{msg.t}</p>}
      </form>
    </>
  );
}
