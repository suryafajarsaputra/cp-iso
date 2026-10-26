'use client';
import { useEffect, useState } from 'react';
import { defaultContent } from '@/lib/content';

const ICONS = [['shield', 'Perisai'], ['lock', 'Gembok'], ['wifi', 'Jaringan'], ['server', 'Server'], ['database', 'Database'], ['cloud', 'Cloud'], ['build', 'Perangkat']];
const COLORS = [['yellow', 'Kuning'], ['orange', 'Oranye'], ['red', 'Merah'], ['crimson', 'Merah tua'], ['maroon', 'Marun (judul & footer)']];

function T({ label, value, onChange, rows, hint }) {
  return (
    <label>{label}
      {rows ? <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /> : <input value={value} onChange={(e) => onChange(e.target.value)} />}
      {hint && <small className="hint">{hint}</small>}
    </label>
  );
}

function Img({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true); setErr('');
    const fd = new FormData(); fd.append('file', file);
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const j = await r.json();
    setBusy(false); e.target.value = '';
    if (r.ok) onChange(j.filename); else setErr(j.error);
  }
  return (
    <div className="imgf">
      <span>{label}</span>
      {value && <img src={`/api/file/${value}`} alt="" />}
      <div>
        <label className="btn btn-sm filebtn">{busy ? 'Mengunggah...' : value ? 'Ganti foto' : 'Pilih foto'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} hidden />
        </label>
        {value && <button type="button" className="lnk danger" onClick={() => onChange('')}>Hapus foto</button>}
      </div>
      {err && <small className="note err">{err}</small>}
    </div>
  );
}

function Strings({ label, items, onChange, addLabel }) {
  const set = (i, v) => onChange(items.map((x, k) => (k === i ? v : x)));
  return (
    <div className="strs">
      <span>{label}</span>
      {items.map((s, i) => (
        <div key={i} className="strrow">
          <input value={s} onChange={(e) => set(i, e.target.value)} />
          <button type="button" className="lnk danger" onClick={() => onChange(items.filter((_, k) => k !== i))}>Hapus</button>
        </div>
      ))}
      <button type="button" className="lnk" onClick={() => onChange([...items, ''])}>+ {addLabel}</button>
    </div>
  );
}

function List({ items, onChange, template, render, addLabel, itemLabel }) {
  const mv = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const a = [...items]; [a[i], a[j]] = [a[j], a[i]]; onChange(a);
  };
  return (
    <div className="lst">
      {items.map((it, i) => (
        <div className="lst-item" key={i}>
          <div className="lst-bar">
            <b>{itemLabel} {i + 1}</b>
            <span>
              <button type="button" className="lnk" onClick={() => mv(i, -1)}>↑</button>
              <button type="button" className="lnk" onClick={() => mv(i, 1)}>↓</button>
              <button type="button" className="lnk danger" onClick={() => onChange(items.filter((_, k) => k !== i))}>Hapus</button>
            </span>
          </div>
          {render(it, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))))}
        </div>
      ))}
      <button type="button" className="btn btn-sm" onClick={() => onChange([...items, structuredClone(template)])}>+ {addLabel}</button>
    </div>
  );
}

function Sec({ title, children, open }) {
  return (
    <details className="adm-card sec-d" open={open}>
      <summary>{title}</summary>
      <div className="form">{children}</div>
    </details>
  );
}

export default function ContentAdmin() {
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState({ t: '', ok: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetch('/api/admin/content').then((r) => r.json()).then(setC); }, []);

  const set = (path, val) => setC((prev) => {
    const n = structuredClone(prev);
    let o = n;
    path.slice(0, -1).forEach((k) => { o = o[k]; });
    o[path[path.length - 1]] = val;
    return n;
  });
  const f = (path) => ({ value: path.reduce((o, k) => o[k], c), onChange: (v) => set(path, v) });

  async function save() {
    setBusy(true); setMsg({ t: '', ok: true });
    const r = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) });
    const j = await r.json();
    setBusy(false);
    setMsg(r.ok ? { t: 'Tersimpan. Perubahan sudah tampil di website.', ok: true } : { t: j.error, ok: false });
  }
  function reset() {
    if (!confirm('Kembalikan semua teks ke isi bawaan? (Foto yang dipasang akan dilepas.) Belum tersimpan sampai Anda menekan Simpan.')) return;
    setC(structuredClone(defaultContent));
  }

  if (!c) return <p className="empty">Memuat...</p>;

  return (
    <>
      <h1>Konten website</h1>
      <p className="hint">Ubah teks, foto, dan poin yang tampil di website, lalu tekan <b>Simpan</b> di bagian bawah.</p>

      <Sec title="1. Umum, tampilan, dan bagian yang ditampilkan" open>
        <T label="Nama singkat perusahaan" {...f(['brand', 'name'])} />
        <T label="Nama lengkap perusahaan" {...f(['brand', 'fullName'])} />
        <div className="chkgrid">
          {[['stats', 'Statistik'], ['about', 'Tentang'], ['services', 'Layanan'], ['values', 'Keunggulan'], ['gallery', 'Galeri'], ['contact', 'Kontak']].map(([k, l]) => (
            <label key={k} className="chk"><input type="checkbox" checked={c.show[k]} onChange={(e) => set(['show', k], e.target.checked)} /> Tampilkan {l}</label>
          ))}
        </div>
        <div className="colors">
          {COLORS.map(([k, l]) => (
            <label key={k}>{l}<input type="color" value={c.theme[k]} onChange={(e) => set(['theme', k], e.target.value)} /></label>
          ))}
        </div>
        <button type="button" className="lnk" onClick={() => setC({ ...c, theme: structuredClone(defaultContent.theme) })}>Kembalikan warna bawaan</button>
      </Sec>

      <Sec title="2. Hero (bagian pembuka)">
        <T label="Judul besar" rows={2} {...f(['hero', 'title'])} />
        <T label="Teks pengantar" rows={3} {...f(['hero', 'text'])} />
        <div className="row2">
          <T label="Teks tombol 1" {...f(['hero', 'button1'])} />
          <T label="Teks tombol 2" {...f(['hero', 'button2'])} />
        </div>
        <Img label="Foto hero (opsional, menggantikan logo besar)" {...f(['hero', 'image'])} />
      </Sec>

      <Sec title="3. Statistik">
        <List items={c.stats} itemLabel="Angka" addLabel="Tambah statistik" template={{ n: '', l: '' }} onChange={(v) => set(['stats'], v)}
          render={(it, up) => (
            <div className="row2">
              <T label="Angka (mis. 10+)" value={it.n} onChange={(v) => up({ n: v })} />
              <T label="Keterangan" value={it.l} onChange={(v) => up({ l: v })} />
            </div>
          )} />
      </Sec>

      <Sec title="4. Tentang kami, visi, dan misi">
        <T label="Judul bagian" {...f(['about', 'title'])} />
        <T label="Paragraf 1" rows={4} {...f(['about', 'p1'])} />
        <T label="Paragraf 2" rows={3} {...f(['about', 'p2'])} />
        <Img label="Foto tentang kami (opsional)" {...f(['about', 'image'])} />
        <div className="row2">
          <T label="Judul visi" {...f(['about', 'visionTitle'])} />
          <T label="Judul misi" {...f(['about', 'missionTitle'])} />
        </div>
        <T label="Isi visi" rows={2} {...f(['about', 'vision'])} />
        <Strings label="Poin misi" addLabel="Tambah poin misi" {...{ items: c.about.missions, onChange: (v) => set(['about', 'missions'], v) }} />
      </Sec>

      <Sec title="5. Layanan">
        <T label="Judul bagian" {...f(['services', 'title'])} />
        <T label="Teks pengantar" rows={2} {...f(['services', 'lead'])} />
        <List items={c.services.items} itemLabel="Layanan" addLabel="Tambah layanan" template={{ icon: 'shield', title: '', desc: '', image: '', points: [''] }} onChange={(v) => set(['services', 'items'], v)}
          render={(it, up) => (
            <>
              <div className="row2">
                <T label="Nama layanan" value={it.title} onChange={(v) => up({ title: v })} />
                <label>Ikon
                  <select value={it.icon} onChange={(e) => up({ icon: e.target.value })}>
                    {ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
              </div>
              <T label="Deskripsi" rows={2} value={it.desc} onChange={(v) => up({ desc: v })} />
              <Img label="Foto layanan (opsional)" value={it.image} onChange={(v) => up({ image: v })} />
              <Strings label="Poin-poin layanan" addLabel="Tambah poin" items={it.points} onChange={(v) => up({ points: v })} />
            </>
          )} />
      </Sec>

      <Sec title="6. Keunggulan">
        <T label="Judul bagian" {...f(['values', 'title'])} />
        <List items={c.values.items} itemLabel="Keunggulan" addLabel="Tambah keunggulan" template={{ title: '', desc: '' }} onChange={(v) => set(['values', 'items'], v)}
          render={(it, up) => (
            <>
              <T label="Judul" value={it.title} onChange={(v) => up({ title: v })} />
              <T label="Deskripsi" rows={2} value={it.desc} onChange={(v) => up({ desc: v })} />
            </>
          )} />
      </Sec>

      <Sec title="7. Galeri (judul bagian; foto diatur di menu Galeri foto)">
        <T label="Judul bagian" {...f(['gallery', 'title'])} />
        <T label="Teks pengantar" rows={2} {...f(['gallery', 'lead'])} />
      </Sec>

      <Sec title="8. Kontak dan lokasi">
        <T label="Judul bagian" {...f(['contact', 'title'])} />
        <T label="Teks pengantar" rows={2} {...f(['contact', 'lead'])} />
        <div className="row2">
          <T label="Email" {...f(['contact', 'email'])} />
          <T label="Nomor telepon / WhatsApp" {...f(['contact', 'phone'])} />
        </div>
        <T label="Jam buka" {...f(['contact', 'hours'])} />
        <T label="Alamat lokasi" rows={3} {...f(['contact', 'address'])} />
        <T label="Link Google Maps (opsional)" {...f(['contact', 'maps_url'])} hint="Contoh: https://maps.app.goo.gl/..." />
      </Sec>

      <Sec title="9. Footer">
        <T label="Teks footer (setelah tanda © dan tahun)" {...f(['footer', 'text'])} />
      </Sec>

      <div className="savebar">
        <button className="btn" onClick={save} disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan semua perubahan'}</button>
        <button className="lnk" onClick={reset}>Kembalikan ke isi bawaan</button>
        {msg.t && <span className={msg.ok ? 'note ok' : 'note err'}>{msg.t}</span>}
      </div>
    </>
  );
}
