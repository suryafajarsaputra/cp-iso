'use client';
import { useState } from 'react';

export default function GalleryGrid({ items }) {
  const cats = ['Semua', ...new Set(items.map((i) => i.category))];
  const [cat, setCat] = useState('Semua');
  const [view, setView] = useState(null);
  const shown = cat === 'Semua' ? items : items.filter((i) => i.category === cat);

  if (!items.length)
    return <p className="empty">Galeri proyek akan tampil di sini setelah foto ditambahkan lewat halaman admin.</p>;

  return (
    <>
      {cats.length > 2 && (
        <div className="chips">
          {cats.map((c) => (
            <button key={c} className={c === cat ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      )}
      <div className="grid-gal">
        {shown.map((i) => (
          <button key={i.id} className="shot" onClick={() => setView(i)}>
            <img src={`/api/file/${i.filename}`} alt={i.title} loading="lazy" />
            <span><b>{i.title}</b><small>{i.category}</small></span>
          </button>
        ))}
      </div>
      {view && (
        <div className="lightbox" onClick={() => setView(null)} role="dialog" aria-label={view.title}>
          <img src={`/api/file/${view.filename}`} alt={view.title} />
          <p>{view.title}</p>
        </div>
      )}
    </>
  );
}
