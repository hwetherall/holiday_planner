'use client';
import { useState } from 'react';
import { api, setToken } from '../lib/api';
import PinInput from './components/PinInput';

export default function Page(){
  const [groupCode, setGroupCode] = useState('HARRY');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(){
    if(!groupCode || !pin || pin.length !== 4) return;
    setLoading(true);
    setError('');
    try{
      const r = await api.post('/auth/login', { groupCode, pin });
      setToken(r.data.token);
      window.location.href = '/questionnaire';
    }catch(e: any){
      setError(e.response?.data?.error || 'Login failed');
    }finally{
      setLoading(false);
    }
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
              <PinInput 
                value={pin} 
                onChange={setPin} 
                length={4}
                className="mb-4"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button 
              onClick={login} 
              disabled={loading || pin.length !== 4}
              className={`holiday-button w-full text-lg py-4 ${loading || pin.length !== 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '🔄 Logging in...' : '🎉 Start Your Holiday Adventure'}
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


