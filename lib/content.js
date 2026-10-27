// Ubah isi di sini untuk mengganti teks company profile.
export const company = {
  name: 'ISO',
  fullName: 'PT ISO Teknologi Indonesia',
  tagline: 'Infrastruktur TI yang aman, cepat, dan siap tumbuh bersama bisnis Anda.',
  email: 'info@iso.co.id',
  phone: '+62 31 0000 0000',
  address: 'Surabaya, Jawa Timur, Indonesia',
  hours: 'Senin – Jumat, 08.00 – 17.00 WIB',
};

export const services = [
  {
    icon: 'shield',
    title: 'Network & Cyber Security',
    desc: 'Jaringan yang stabil dan terlindungi dari ancaman, dirancang, dipasang, dan dipantau oleh tim kami.',
    points: ['Desain & implementasi jaringan LAN/WAN', 'Firewall, VPN, dan segmentasi jaringan', 'Penetration test & audit keamanan', 'Monitoring dan respons insiden'],
  },
  {
    icon: 'server',
    title: 'Compute & Storage Solutions',
    desc: 'Server, virtualisasi, dan penyimpanan yang disesuaikan dengan beban kerja dan anggaran Anda.',
    points: ['Server rack, blade, dan hyper-converged', 'Virtualisasi dan private cloud', 'SAN/NAS dan backup terjadwal', 'Pemeliharaan dan garansi perangkat'],
  },
  {
    icon: 'database',
    title: 'Data Center Solution',
    desc: 'Ruang server yang andal, dari perencanaan hingga operasional harian.',
    points: ['Perancangan dan pembangunan ruang server', 'Power, pendingin, dan kabel terstruktur', 'Disaster recovery dan high availability', 'Migrasi data center tanpa henti layanan'],
  },
];

export const values = [
  { title: 'Berpengalaman', desc: 'Tim bersertifikasi yang sudah menangani proyek untuk instansi dan perusahaan.' },
  { title: 'Respons cepat', desc: 'Dukungan teknis yang dapat dihubungi saat sistem Anda bermasalah.' },
  { title: 'Sesuai kebutuhan', desc: 'Solusi dirancang dari kondisi nyata Anda, bukan paket yang dipaksakan.' },
  { title: 'Terukur', desc: 'Setiap proyek punya target, jadwal, dan laporan yang jelas.' },
];

export const stats = [
  { n: '10+', l: 'Tahun pengalaman' },
  { n: '200+', l: 'Proyek selesai' },
  { n: '80+', l: 'Klien aktif' },
  { n: '24/7', l: 'Dukungan teknis' },
];

// ---- Konten bawaan: semua bagian ini bisa diedit lewat /adsmins/content ----
export const defaultContent = {
  brand: { name: 'ISO', fullName: company.fullName },
  theme: { yellow: '#F7C921', orange: '#F08A24', red: '#E8452A', crimson: '#C62828', maroon: '#6B1C26' },
  show: { stats: true, about: true, services: true, values: true, gallery: true, contact: true },
  hero: {
    title: 'Infrastruktur TI yang kuat untuk bisnis yang terus melaju.',
    text: company.tagline + ' Kami merancang, membangun, dan menjaga jaringan, server, dan data center Anda.',
    button1: 'Lihat layanan',
    button2: 'Konsultasi gratis',
    image: '',
  },
  stats,
  about: {
    title: 'Tentang kami',
    p1: company.fullName + ' adalah penyedia solusi infrastruktur teknologi informasi yang berfokus pada keamanan jaringan, komputasi dan penyimpanan data, serta data center. Kami membantu instansi dan perusahaan menjaga sistem pentingnya tetap berjalan, aman, dan siap berkembang.',
    p2: 'Setiap proyek kami mulai dari memahami kebutuhan Anda, lalu merancang solusi, memasangnya, dan mendampingi operasionalnya setelah serah terima.',
    image: '',
    visionTitle: 'Visi',
    vision: 'Menjadi mitra infrastruktur TI yang paling dipercaya di Indonesia.',
    missionTitle: 'Misi',
    missions: [
      'Menghadirkan solusi TI yang aman dan andal.',
      'Memberi layanan purna jual yang cepat dan transparan.',
      'Mengembangkan tim yang terus belajar dan bersertifikasi.',
    ],
  },
  services: {
    title: 'Layanan kami',
    lead: 'Tiga bidang utama yang kami kerjakan dari perencanaan sampai pemeliharaan.',
    items: services.map((s) => ({ ...s, image: '' })),
  },
  values: { title: 'Mengapa memilih kami', items: values },
  gallery: { title: 'Galeri proyek', lead: 'Dokumentasi pekerjaan dan perangkat yang telah kami pasang.' },
  contact: {
    title: 'Hubungi kami',
    lead: 'Ceritakan kebutuhan Anda. Kami balas dalam 1 hari kerja.',
    email: company.email,
    phone: company.phone,
    hours: company.hours,
    address: company.address,
    maps_url: '',
  },
  footer: { text: company.fullName + '. Seluruh hak cipta dilindungi.' },
};
