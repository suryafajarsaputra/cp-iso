'use client';
import { useEffect, useState } from 'react';

export default function BannersAdmin() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState({ t: '', ok: true });
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(null);

  const load = async () => {
    const r = await fetch('/api/admin/banners');
    if (r.ok) setItems(await r.json());
  };
  useEffect(() => { load(); }, []);

  const put = (id, body) => fetch(`/api/admin/banners/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  async function add(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setMsg({ t: '', ok: true });
    const r = await fetch('/api/admin/banners', { method: 'POST', body: new FormData(form) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg({ t: j.error, ok: false });
    form.reset(); setMsg({ t: 'Banner ditambahkan.', ok: true }); load();
  }
  async function save() {
    await put(edit.id, { title: edit.title, caption: edit.caption, link: edit.link });
    setEdit(null); setMsg({ t: 'Perubahan disimpan.', ok: true }); load();
  }
  async function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const a = items[i], b = items[j];
    await Promise.all([put(a.id, { sort_order: j + 1 }), put(b.id, { sort_order: i + 1 })]);
    // pastikan urutan unik
    await Promise.all(items.map((x, k) => (x.id !== a.id && x.id !== b.id ? put(x.id, { sort_order: k + 1 }) : null)));
    load();
  }
  async function remove(b) {
    if (!confirm('Hapus banner ini?')) return;
    await fetch(`/api/admin/banners/${b.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <h1>Banner atas website</h1>
      <p className="hint">Banner tampil sebagai slider di bagian paling atas website. Ukuran terbaik 1600 × 600 px (JPG/PNG/WEBP, maks 5 MB). Jika kosong, slider tidak ditampilkan.</p>
      <form className="adm-card form" onSubmit={add}>
        <h2>Tambah banner</h2>
        <label>File foto<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label>
        <div className="row3">
          <label>Judul (opsional)<input name="title" maxLength={150} /></label>
          <label>Teks singkat (opsional)<input name="caption" maxLength={300} /></label>
          <label>Link tombol (opsional)<input name="link" placeholder="#kontak atau https://..." maxLength={300} /></label>
        </div>
        <button className="btn" disabled={busy}>{busy ? 'Mengunggah...' : 'Tambah banner'}</button>
        {msg.t && <p className={msg.ok ? 'note ok' : 'note err'}>{msg.t}</p>}
      </form>

      {!items.length ? <p className="empty">Belum ada banner.</p> : (
        <div className="banner-list">
          {items.map((b, i) => (
            <div className={`adm-card brow ${b.active ? '' : 'off'}`} key={b.id}>
              <img src={`/api/file/${b.filename}`} alt={b.title} />
              {edit?.id === b.id ? (
                <div className="form">
                  <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Judul" />
                  <input value={edit.caption} onChange={(e) => setEdit({ ...edit, caption: e.target.value })} placeholder="Teks singkat" />
                  <input value={edit.link} onChange={(e) => setEdit({ ...edit, link: e.target.value })} placeholder="Link tombol" />
                  <div><button className="btn btn-sm" onClick={save}>Simpan</button> <button className="lnk" onClick={() => setEdit(null)}>Batal</button></div>
                </div>
              ) : (
                <div className="meta">
                  <b>{b.title || '(tanpa judul)'}</b>
                  <small>{b.caption}</small>
                  {b.link && <small>Link: {b.link}</small>}
                  <div>
                    <button className="lnk" onClick={() => move(i, -1)} disabled={i === 0}>↑ Naik</button>
                    <button className="lnk" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓ Turun</button>
                    <button className="lnk" onClick={() => put(b.id, { active: !b.active }).then(load)}>{b.active ? 'Sembunyikan' : 'Tampilkan'}</button>
                    <button className="lnk" onClick={() => setEdit({ id: b.id, title: b.title, caption: b.caption, link: b.link })}>Edit</button>
                    <button className="lnk danger" onClick={() => remove(b)}>Hapus</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
