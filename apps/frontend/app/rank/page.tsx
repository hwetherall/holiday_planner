'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { CandidateCard } from '@fhp/shared';
import HolidayLoading from '../components/HolidayLoading';

export default function Page(){
  const [cards, setCards] = useState<CandidateCard[]>([]);
  const [candidateSetId, setSetId] = useState<string>('');
  const [ranks, setRanks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  async function loadExistingCards(){
    const curr = await api.get('/cards/latest');
    if(curr.data.cards?.length===5){ 
      setCards(curr.data.cards); 
      setSetId(curr.data.candidateSetId); 
      setLoading(false); 
      return true; 
    }
    return false;
  }

  async function generateNewCards(){
    setLoading(true);
    const r = await api.post('/cards/generate', {});
    setCards(r.data.cards); 
    setSetId(r.data.candidateSetId); 
    setLoading(false);
  }

  async function ensureCards(){
    const hasExisting = await loadExistingCards();
    if (!hasExisting) {
      await generateNewCards();
    }
  }

  useEffect(()=>{ ensureCards(); },[]);

  function setRank(id:string, val:number){ setRanks(prev=>({ ...prev, [id]: val })); }

  async function submit(){
    if(Object.keys(ranks).length!==5) return alert('Please rank all 5 cards (1–5).');
    const values = Object.values(ranks);
    if(new Set(values).size!==5 || values.some(v=>v<1||v>5)) return alert('Ranks must be 1–5 with no ties.');
    await api.post('/ranking/submit', { candidateSetId, ranking: ranks });
    window.location.href = '/results';
  }

  const progress = Math.round((Object.keys(ranks).length / 5) * 100);

  if(loading) return <HolidayLoading />;

  return (
    <div className="min-h-screen holiday-pattern">
      {/* Floating holiday elements */}
      <div className="floating-element" style={{ top: '5%', left: '10%' }}>🏖️</div>
      <div className="floating-element" style={{ top: '15%', right: '5%' }}>✈️</div>
      <div className="floating-element" style={{ bottom: '10%', left: '20%' }}>🏔️</div>
      
      <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="holiday-card rounded-2xl p-8 section-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
                Step 2 — Rank Your 5 Ideas
              </h1>
              <p className="text-lg opacity-70 mt-2">
                Rate each destination from 1 (best) to 5 (worst). No ties allowed!
              </p>
            </div>
            <button 
              onClick={generateNewCards}
              disabled={loading}
              className="holiday-button"
            >
              {loading ? '🔄 Generating...' : '🔄 Generate New Ideas'}
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {Object.keys(ranks).length}/5 ranked
              </span>
              <span className="text-sm text-gray-500">{progress}% Complete</span>
            </div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, index) => (
            <div 
              key={c.id} 
              className="holiday-card rounded-2xl overflow-hidden section-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video bg-gradient-to-br from-emerald-200 to-orange-200 relative overflow-hidden">
                {(c as any).imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={(c as any).imageUrl} 
                    alt={c.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <span className="text-emerald-900 font-medium">{c.destinationKey}</span>
                    </div>
                  </div>
                )}
                {/* Rank badge */}
                {ranks[c.id] && (
                  <div className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-emerald-600">{ranks[c.id]}</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl text-gray-800">{c.title}</h3>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Highlights</h4>
                  <ul className="space-y-1">
                    {c.facts.slice(0, 4).map((f, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 italic">"{c.pitch}"</p>
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rank this destination
                  </label>
                  <select 
                    value={ranks[c.id] || ''} 
                    onChange={e => setRank(c.id, Number(e.target.value))} 
                    className="holiday-input w-full"
                  >
                    <option value="">Select rank (1-5)</option>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>
                        {n} - {n === 1 ? 'Best' : n === 5 ? 'Worst' : `${n}${n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center section-fade-in">
          <button 
            onClick={submit} 
            disabled={Object.keys(ranks).length !== 5}
            className="holiday-button text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Object.keys(ranks).length === 5 ? '🎉 Submit Ranking & See Results' : 'Please rank all 5 destinations'}
          </button>
        </div>
      </main>
    </div>
  );
}


