'use client';
import { useState } from 'react';
import { api, setToken } from '../lib/api';

export default function Page(){
  const [groupCode, setGroupCode] = useState('A');
  const [pin, setPin] = useState('');
  const [token, setTok] = useState<string|undefined>();

  async function login(){
    const r = await api.post('/auth/login', { groupCode, pin });
    setTok(r.data.token); setToken(r.data.token);
    window.location.href = '/questionnaire';
  }

  return (
    <main className="max-w-md mx-auto py-16 space-y-6">
      <h1 className="text-3xl font-bold">Holiday Genie ✈️</h1>
      <p className="text-sm opacity-70">Enter your group and 4‑digit PIN to begin.</p>
      <div className="space-y-3">
        <label className="block text-sm">Group</label>
        <select value={groupCode} onChange={e=>setGroupCode(e.target.value)} className="w-full rounded-lg p-2 border">
          <option value="A">A — Harry, Ky, Occi</option>
          <option value="B">B — Mum + Johno</option>
          <option value="C">C — Liv + Ben</option>
          <option value="D">D — Victoria + Jim</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="block text-sm">PIN</label>
        <input value={pin} onChange={e=>setPin(e.target.value)} inputMode="numeric" maxLength={4} className="w-full rounded-lg p-2 border" />
      </div>
      <button onClick={login} className="rounded-xl px-4 py-2 bg-emerald-600 text-white">Start</button>
    </main>
  );
}


