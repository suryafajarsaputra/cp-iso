import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import GalleryGrid from '@/components/GalleryGrid';
import ContactForm from '@/components/ContactForm';
import BannerSlider from '@/components/BannerSlider';
import { pool } from '@/lib/db';
import { getContent, ensureTables } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

async function getGallery() {
  try {
    const [rows] = await pool.query('SELECT id,title,category,filename FROM gallery ORDER BY id DESC LIMIT 36');
    return rows;
  } catch { return []; }
}
async function getBanners() {
  try {
    await ensureTables();
    const [rows] = await pool.query('SELECT id,title,caption,link,filename FROM banners WHERE active=1 ORDER BY sort_order,id');
    return rows;
  } catch { return []; }
}

const img = (f) => `/api/file/${f}`;

export default async function Home() {
  const [gallery, banners, c] = await Promise.all([getGallery(), getBanners(), getContent()]);
  const t = c.theme;
  const css = `:root{--yellow:${t.yellow};--orange:${t.orange};--red:${t.red};--crimson:${t.crimson};--maroon:${t.maroon}}`;
  const show = c.show;
  const links = [
    show.about && ['#tentang', 'Tentang'],
    show.services && ['#layanan', 'Layanan'],
    show.values && ['#keunggulan', 'Keunggulan'],
    show.gallery && ['#galeri', 'Galeri'],
    show.contact && ['#kontak', 'Kontak'],
  ].filter(Boolean);
  const k = c.contact;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navbar links={links} brand={c.brand.name} />
      <BannerSlider slides={JSON.parse(JSON.stringify(banners))} />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-in">
            <div className="hero-copy">
              <h1>{c.hero.title}</h1>
              <p>{c.hero.text}</p>
              <div className="cta">
                {c.hero.button1 && <a href={show.services ? '#layanan' : '#kontak'} className="btn">{c.hero.button1}</a>}
                {c.hero.button2 && <a href="#kontak" className="btn btn-ghost">{c.hero.button2}</a>}
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <i className="f f1" /><i className="f f2" /><i className="f f3" />
              {c.hero.image ? <img className="hero-photo" src={img(c.hero.image)} alt="" /> : <img src="/logo-clear.png" alt="" />}
            </div>
          </div>
          {show.stats && c.stats.length > 0 && (
            <div className="wrap stats">
              {c.stats.map((s, i) => (
                <div key={i}><strong>{s.n}</strong><span>{s.l}</span></div>
              ))}
            </div>
          )}
        </section>

        {/* TENTANG */}
        {show.about && (
          <section id="tentang" className="sec">
            <div className="wrap about">
              <div>
                <h2>{c.about.title}</h2>
                {c.about.p1 && <p>{c.about.p1}</p>}
                {c.about.p2 && <p>{c.about.p2}</p>}
                {c.about.image && <img className="about-img" src={img(c.about.image)} alt={c.about.title} />}
              </div>
              <div className="vm">
                {c.about.vision && (
                  <div><h3>{c.about.visionTitle}</h3><p>{c.about.vision}</p></div>
                )}
                {c.about.missions.length > 0 && (
                  <div>
                    <h3>{c.about.missionTitle}</h3>
                    <ul>{c.about.missions.map((m, i) => <li key={i}>{m}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* LAYANAN */}
        {show.services && (
          <section id="layanan" className="sec soft">
            <div className="wrap">
              <h2>{c.services.title}</h2>
              {c.services.lead && <p className="lead">{c.services.lead}</p>}
              <div className="svc">
                {c.services.items.map((s, i) => (
                  <article key={i} className="card">
                    {s.image && <img className="cimg" src={img(s.image)} alt={s.title} loading="lazy" />}
                    <div className="ico"><Icon name={s.icon} size={30} /></div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <ul>
                      {s.points.filter(Boolean).map((p, j) => (
                        <li key={j}><Icon name="check" size={18} />{p}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* KEUNGGULAN */}
        {show.values && (
          <section id="keunggulan" className="sec">
            <div className="wrap">
              <h2>{c.values.title}</h2>
              <div className="vals">
                {c.values.items.map((v, i) => (
                  <div key={i}><h3>{v.title}</h3><p>{v.desc}</p></div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALERI */}
        {show.gallery && (
          <section id="galeri" className="sec soft">
            <div className="wrap">
              <h2>{c.gallery.title}</h2>
              {c.gallery.lead && <p className="lead">{c.gallery.lead}</p>}
              <GalleryGrid items={JSON.parse(JSON.stringify(gallery))} />
            </div>
          </section>
        )}

        {/* KONTAK */}
        {show.contact && (
          <section id="kontak" className="sec">
            <div className="wrap contact">
              <div>
                <h2>{c.contact.title}</h2>
                {c.contact.lead && <p className="lead">{c.contact.lead}</p>}
                <ul className="info">
                  {k.address && (
                    <li><Icon name="pin" size={22} /><span>{k.address}{k.maps_url && (<><br /><a className="maplink" href={k.maps_url} target="_blank" rel="noreferrer">Buka di Google Maps</a></>)}</span></li>
                  )}
                  {k.phone && <li><Icon name="phone" size={22} /><a href={`tel:${k.phone.replace(/[^+\d]/g, '')}`}>{k.phone}</a></li>}
                  {k.email && <li><Icon name="mail" size={22} /><a href={`mailto:${k.email}`}>{k.email}</a></li>}
                  {k.hours && <li><Icon name="clock" size={22} />{k.hours}</li>}
                </ul>
              </div>
              <ContactForm />
            </div>
          </section>
        )}
      </main>

      <footer className="foot">
        <div className="wrap foot-in">
          <img src="/logo-clear.png" alt={c.brand.name} />
          <p>© {new Date().getFullYear()} {c.footer.text}</p>
        </div>
      </footer>
    </>
  );
}
