'use client';
import { useState } from 'react';

export default function Login() {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { window.location.href = '/adsmins/content'; return; }
    setErr((await r.json()).error || 'Gagal masuk.');
    setBusy(false);
  }

  return (
    <div className="adm-login">
      <form onSubmit={submit} className="adm-box">
        <img src="/logo-clear.png" alt="ISO" />
        <h1>Masuk admin</h1>
        <label>Username<input name="username" autoFocus required /></label>
        <label>Password<input name="password" type="password" required /></label>
        {err && <p className="note err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Memeriksa...' : 'Masuk'}</button>
      </form>
    </div>
  );
}
