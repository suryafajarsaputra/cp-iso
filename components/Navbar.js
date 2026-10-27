'use client';
import { useState } from 'react';

export default function Navbar({ links = [], brand = 'ISO' }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a href="#top" className="brand" aria-label={`${brand} beranda`}>
          <img src="/logo-clear.png" alt={brand} />
        </a>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={open ? 'open' : ''}>
          {links.map(([h, t]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a href="#kontak" className="btn btn-sm" onClick={() => setOpen(false)}>Hubungi kami</a>
        </nav>
      </div>
    </header>
  );
}
