import AdminNav from '@/components/AdminNav';

export const metadata = { title: 'Admin | ISO', robots: { index: false } };

export default function PanelLayout({ children }) {
  return (
    <div className="adm">
      <AdminNav />
      <main className="adm-main">{children}</main>
    </div>
  );
}
