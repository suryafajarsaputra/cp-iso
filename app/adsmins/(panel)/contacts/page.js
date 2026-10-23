'use client';
import { useEffect, useState } from 'react';

export default function ContactsAdmin() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(null);

  const load = async () => {
    const r = await fetch('/api/admin/contacts');
    if (r.ok) setRows(await r.json());
  };
  useEffect(() => { load(); }, []);

  async function toggle(c, is_read) {
    await fetch(`/api/admin/contacts/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_read }) });
    load();
  }
  async function expand(c) {
    setOpen(open === c.id ? null : c.id);
    if (!c.is_read) toggle(c, true);
  }
  async function remove(c) {
    if (!confirm(`Hapus pesan dari ${c.name}?`)) return;
    await fetch(`/api/admin/contacts/${c.id}`, { method: 'DELETE' });
    load();
  }

  const unread = rows.filter((r) => !r.is_read).length;
  const fmt = (d) => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <>
      <h1>Pesan masuk {unread > 0 && <span className="badge">{unread} baru</span>}</h1>
      {!rows.length ? <p className="empty">Belum ada pesan dari formulir kontak.</p> : (
        <div className="msgs">
          {rows.map((c) => (
            <div key={c.id} className={`adm-card msg ${c.is_read ? '' : 'unread'}`}>
              <button className="msg-head" onClick={() => expand(c)}>
                <b>{c.name}</b>
                <span>{c.subject || 'Tanpa topik'}</span>
                <small>{fmt(c.created_at)}</small>
              </button>
              {open === c.id && (
                <div className="msg-body">
                  <p className="who">
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                    {c.phone && <> &nbsp;|&nbsp; <a href={`tel:${c.phone}`}>{c.phone}</a></>}
                  </p>
                  <p className="txt">{c.message}</p>
                  <div>
                    <button className="lnk" onClick={() => toggle(c, false)}>Tandai belum dibaca</button>
                    <button className="lnk danger" onClick={() => remove(c)}>Hapus</button>
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
