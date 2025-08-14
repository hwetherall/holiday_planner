'use client';
import { useState } from 'react';
import { api, setToken } from '../lib/api';

export default function Page(){
  const [groupCode, setGroupCode] = useState('HARRY');
  const [pin, setPin] = useState('');
  const [token, setTok] = useState<string|undefined>();

  async function login(){
    const r = await api.post('/auth/login', { groupCode, pin });
    setTok(r.data.token); setToken(r.data.token);
    window.location.href = '/questionnaire';
  }

  return (
    <div className="min-h-screen holiday-pattern">
      {/* Floating holiday elements */}
      <div className="floating-element" style={{ top: '15%', left: '10%' }}>🏖️</div>
      <div className="floating-element" style={{ top: '25%', right: '15%' }}>✈️</div>
      <div className="floating-element" style={{ bottom: '20%', left: '20%' }}>🏔️</div>
      <div className="floating-element" style={{ bottom: '30%', right: '10%' }}>🗺️</div>
      
      <main className="max-w-md mx-auto py-16 px-4">
        <div className="holiday-card rounded-2xl p-8 section-fade-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧞‍♂️</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Holiday Genie
            </h1>
            <p className="text-lg opacity-70">
              Your magical guide to the perfect family holiday
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Your Name</label>
              <select 
                value={groupCode} 
                onChange={e=>setGroupCode(e.target.value)} 
                className="holiday-input w-full"
              >
                <option value="HARRY">Harry (Denver)</option>
                <option value="KYLENE">Kylene (Denver)</option>
                <option value="OLIVIA">Olivia (Melbourne)</option>
                <option value="BEN">Ben (Melbourne)</option>
                <option value="VICTORIA">Victoria (Melbourne)</option>
                <option value="JIM">Jim (Melbourne)</option>
                <option value="DEB">Deb (Sydney)</option>
                <option value="JOHNNO">Johnno (Sydney)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Enter Your PIN</label>
              <input 
                value={pin} 
                onChange={e=>setPin(e.target.value)} 
                inputMode="numeric" 
                maxLength={4} 
                placeholder="Enter 4-digit PIN"
                className="holiday-input w-full text-center text-2xl tracking-widest" 
              />
            </div>
            
            <button 
              onClick={login} 
              className="holiday-button w-full text-lg py-4"
            >
              🎉 Start Your Holiday Adventure
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ✨ Let the magic begin! ✨
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


