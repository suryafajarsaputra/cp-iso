'use client';
import { useEffect, useRef, useState } from 'react';

const DELAY = 5000; // 5 detik

export default function BannerSlider({ slides }) {
  const [i, setI] = useState(0);
  const [stamp, setStamp] = useState(0); // berubah setiap ada aktivitas (scroll/klik/geser) -> timer 5 detik diulang
  const [visible, setVisible] = useState(true);
  const ref = useRef(null);
  const touchX = useRef(null);
  const n = slides.length;

  // Ganti otomatis jika 5 detik tidak ada aktivitas
  useEffect(() => {
    if (n < 2 || !visible) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), DELAY);
    return () => clearTimeout(t);
  }, [i, n, stamp, visible]);

  // Scroll halaman = ada aktivitas, hitung ulang 5 detik
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - last > 150) { last = now; setStamp(now); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Berhenti saat banner tidak terlihat di layar
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [n]);

  if (!n) return null;
  const go = (d) => { setI((x) => (x + d + n) % n); setStamp(Date.now()); };
  const jump = (k) => { setI(k); setStamp(Date.now()); };

  return (
    <section className="wrap banner" aria-label="Banner" ref={ref}>
      <div
        className="slider"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        {slides.map((s, k) => (
          <figure key={s.id} className={k === i ? 'slide on' : 'slide'} aria-hidden={k !== i}>
            <img src={`/api/file/${s.filename}`} alt={s.title || 'Banner'} />
            {(s.title || s.caption || s.link) && (
              <figcaption>
                {s.title && <b>{s.title}</b>}
                {s.caption && <span>{s.caption}</span>}
                {s.link && <a className="btn btn-sm" href={s.link} tabIndex={k === i ? 0 : -1}>Selengkapnya</a>}
              </figcaption>
            )}
          </figure>
        ))}
        {n > 1 && (
          <>
            <button className="arrow prev" onClick={() => go(-1)} aria-label="Sebelumnya">‹</button>
            <button className="arrow next" onClick={() => go(1)} aria-label="Berikutnya">›</button>
            <div className="dots">
              {slides.map((s, k) => (
                <button key={s.id} className={k === i ? 'on' : ''} onClick={() => jump(k)} aria-label={`Banner ${k + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
