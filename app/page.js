import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import GalleryGrid from '@/components/GalleryGrid';
import ContactForm from '@/components/ContactForm';
import { pool } from '@/lib/db';
import { company, services, values, stats } from '@/lib/content';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

async function getGallery() {
  try {
    const [rows] = await pool.query('SELECT id,title,category,filename FROM gallery ORDER BY id DESC LIMIT 36');
    return rows;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [gallery, cfg] = await Promise.all([getGallery(), getSettings()]);
  return (
    <>
      <Navbar />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-in">
            <div className="hero-copy">
              <h1>Infrastruktur TI yang kuat untuk bisnis yang terus melaju.</h1>
              <p>{company.tagline} Kami merancang, membangun, dan menjaga jaringan, server, dan data center Anda.</p>
              <div className="cta">
                <a href="#layanan" className="btn">Lihat layanan</a>
                <a href="#kontak" className="btn btn-ghost">Konsultasi gratis</a>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <i className="f f1" /><i className="f f2" /><i className="f f3" />
              <img src="/logo-clear.png" alt="" />
            </div>
          </div>
          <div className="wrap stats">
            {stats.map((s) => (
              <div key={s.l}><strong>{s.n}</strong><span>{s.l}</span></div>
            ))}
          </div>
        </section>

        {/* TENTANG */}
        <section id="tentang" className="sec">
          <div className="wrap about">
            <div>
              <h2>Tentang kami</h2>
              <p>
                {company.fullName} adalah penyedia solusi infrastruktur teknologi informasi yang berfokus pada keamanan jaringan,
                komputasi dan penyimpanan data, serta data center. Kami membantu instansi dan perusahaan menjaga sistem pentingnya
                tetap berjalan, aman, dan siap berkembang.
              </p>
              <p>
                Setiap proyek kami mulai dari memahami kebutuhan Anda, lalu merancang solusi, memasangnya, dan mendampingi
                operasionalnya setelah serah terima.
              </p>
            </div>
            <div className="vm">
              <div>
                <h3>Visi</h3>
                <p>Menjadi mitra infrastruktur TI yang paling dipercaya di Indonesia.</p>
              </div>
              <div>
                <h3>Misi</h3>
                <ul>
                  <li>Menghadirkan solusi TI yang aman dan andal.</li>
                  <li>Memberi layanan purna jual yang cepat dan transparan.</li>
                  <li>Mengembangkan tim yang terus belajar dan bersertifikasi.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* LAYANAN */}
        <section id="layanan" className="sec soft">
          <div className="wrap">
            <h2>Layanan kami</h2>
            <p className="lead">Tiga bidang utama yang kami kerjakan dari perencanaan sampai pemeliharaan.</p>
            <div className="svc">
              {services.map((s) => (
                <article key={s.title} className="card">
                  <div className="ico"><Icon name={s.icon} size={30} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <ul>
                    {s.points.map((p) => (
                      <li key={p}><Icon name="check" size={18} />{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* KEUNGGULAN */}
        <section id="keunggulan" className="sec">
          <div className="wrap">
            <h2>Mengapa memilih kami</h2>
            <div className="vals">
              {values.map((v) => (
                <div key={v.title}>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALERI */}
        <section id="galeri" className="sec soft">
          <div className="wrap">
            <h2>Galeri proyek</h2>
            <p className="lead">Dokumentasi pekerjaan dan perangkat yang telah kami pasang.</p>
            <GalleryGrid items={JSON.parse(JSON.stringify(gallery))} />
          </div>
        </section>

        {/* KONTAK */}
        <section id="kontak" className="sec">
          <div className="wrap contact">
            <div>
              <h2>Hubungi kami</h2>
              <p className="lead">Ceritakan kebutuhan Anda. Kami balas dalam 1 hari kerja.</p>
              <ul className="info">
                {cfg.address && (
                  <li><Icon name="pin" size={22} /><span>{cfg.address}{cfg.maps_url && (<><br /><a className="maplink" href={cfg.maps_url} target="_blank" rel="noreferrer">Buka di Google Maps</a></>)}</span></li>
                )}
                {cfg.phone && <li><Icon name="phone" size={22} /><a href={`tel:${cfg.phone.replace(/[^+\d]/g, '')}`}>{cfg.phone}</a></li>}
                {cfg.email && <li><Icon name="mail" size={22} /><a href={`mailto:${cfg.email}`}>{cfg.email}</a></li>}
                {cfg.hours && <li><Icon name="clock" size={22} />{cfg.hours}</li>}
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in">
          <img src="/logo-clear.png" alt="ISO" />
          <p>© {new Date().getFullYear()} {company.fullName}. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </>
  );
}
