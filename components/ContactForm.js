'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [state, setState] = useState({ status: 'idle', msg: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: 'sending', msg: '' });
    const body = Object.fromEntries(new FormData(form));
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      form.reset();
      setState({ status: 'ok', msg: 'Pesan terkirim. Tim kami akan menghubungi Anda secepatnya.' });
    } catch (err) {
      setState({ status: 'err', msg: err.message || 'Pesan belum terkirim.' });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="row2">
        <label>Nama<input name="name" required maxLength={100} /></label>
        <label>Email<input name="email" type="email" required maxLength={150} /></label>
      </div>
      <div className="row2">
        <label>Telepon / WhatsApp<input name="phone" maxLength={30} /></label>
        <label>Topik<input name="subject" maxLength={150} placeholder="mis. Audit keamanan jaringan" /></label>
      </div>
      <label>Pesan<textarea name="message" rows={5} required maxLength={3000} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="btn" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? 'Mengirim...' : 'Kirim pesan'}
      </button>
      {state.msg && <p className={state.status === 'ok' ? 'note ok' : 'note err'} role="status">{state.msg}</p>}
    </form>
  );
}
