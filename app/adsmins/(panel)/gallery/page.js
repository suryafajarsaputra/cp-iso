'use client';
import { useEffect, useState } from 'react';

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState({ t: '', ok: true });
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(null); // {id,title,category}

  const load = async () => {
    const r = await fetch('/api/admin/gallery');
    if (r.ok) setItems(await r.json());
  };
  useEffect(() => { load(); }, []);

  async function upload(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setMsg({ t: '', ok: true });
    const r = await fetch('/api/admin/gallery', { method: 'POST', body: new FormData(form) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setMsg({ t: j.error, ok: false });
    form.reset();
    setMsg({ t: 'Foto ditambahkan.', ok: true });
    load();
  }

  async function save() {
    const r = await fetch(`/api/admin/gallery/${edit.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(edit) });
    if (r.ok) { setEdit(null); setMsg({ t: 'Perubahan disimpan.', ok: true }); load(); }
    else setMsg({ t: (await r.json()).error, ok: false });
  }

  async function remove(i) {
    if (!confirm(`Hapus foto "${i.title}"?`)) return;
    await fetch(`/api/admin/gallery/${i.id}`, { method: 'DELETE' });
    setMsg({ t: 'Foto dihapus.', ok: true });
    load();
  }

  return (
    <>
      <h1>Galeri foto</h1>
      <form className="adm-card form" onSubmit={upload}>
        <h2>Tambah foto</h2>
        <div className="row3">
          <label>Judul<input name="title" required maxLength={150} /></label>
          <label>Kategori<input name="category" placeholder="mis. Data Center" maxLength={60} list="cats" />
            <datalist id="cats">{[...new Set(items.map((i) => i.category))].map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label>File foto (maks 5 MB)<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label>
        </div>
        <button className="btn" disabled={busy}>{busy ? 'Mengunggah...' : 'Unggah foto'}</button>
        {msg.t && <p className={msg.ok ? 'note ok' : 'note err'}>{msg.t}</p>}
      </form>

      {!items.length ? <p className="empty">Belum ada foto. Unggah foto pertama lewat formulir di atas.</p> : (
        <div className="adm-grid">
          {items.map((i) => (
            <div className="adm-item" key={i.id}>
              <img src={`/api/file/${i.filename}`} alt={i.title} />
              {edit?.id === i.id ? (
                <div className="edit">
                  <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
                  <input value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
                  <div><button className="btn btn-sm" onClick={save}>Simpan</button> <button className="lnk" onClick={() => setEdit(null)}>Batal</button></div>
                </div>
              ) : (
                <div className="meta">
                  <b>{i.title}</b><small>{i.category}</small>
                  <div><button className="lnk" onClick={() => setEdit({ id: i.id, title: i.title, category: i.category })}>Edit</button> <button className="lnk danger" onClick={() => remove(i)}>Hapus</button></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
