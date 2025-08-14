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

  if(loading) return <HolidayLoading />;

  return (
    <main className="max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Step 2 — Rank Your 5 Ideas</h1>
        <button 
          onClick={generateNewCards}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate New Ideas'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(c=> (
          <div key={c.id} className="rounded-2xl overflow-hidden shadow bg-white">
            <div className="aspect-video bg-emerald-200">
              {(c as any).imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(c as any).imageUrl} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="p-4 text-center text-emerald-900">{c.destinationKey}</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <ul className="list-disc pl-5 text-sm">
                {c.facts.slice(0,4).map((f,i)=>(<li key={i}>{f}</li>))}
              </ul>
              <p className="text-sm opacity-80">{c.pitch}</p>
              <div className="pt-2">
                <label className="text-sm mr-2">Rank (1 best • 5 worst)</label>
                <select value={ranks[c.id]||''} onChange={e=>setRank(c.id, Number(e.target.value))} className="border rounded p-2">
                  <option value="">Select…</option>
                  {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={submit} className="rounded-xl px-4 py-2 bg-emerald-600 text-white">Submit ranking</button>
    </main>
  );
}


