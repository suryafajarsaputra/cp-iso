import './globals.css';

export const metadata = {
  title: 'ISO | Network & Cyber Security, Compute & Storage, Data Center',
  description: 'ISO menyediakan solusi Network & Cyber Security, Compute & Storage, dan Data Center untuk instansi dan perusahaan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,500;0,700;1,700;1,800;1,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
