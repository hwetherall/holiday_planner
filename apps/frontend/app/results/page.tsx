'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function Page(){
  const [progress, setProgress] = useState<{code:string,submitted:boolean}[]>([]);
  const [result, setResult] = useState<any>(null);

  async function load(){
    const p = await api.get('/status/progress');
    setProgress(p.data.progress);
    const allDone = p.data.progress.every((x:any)=>x.submitted);
    if(allDone){
      const r = await api.post('/consensus/generate', {});
      setResult(r.data.result);
    }
  }
  useEffect(()=>{ load(); },[]);

  return (
    <main className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Step 3 — Final Suggestions</h1>
      <div className="p-4 rounded-xl bg-white shadow">
        <h2 className="font-semibold mb-2">Submission progress</h2>
        <ul className="flex gap-4">
          {progress.map(p=> (
            <li key={p.code} className={p.submitted? 'text-emerald-700' : 'text-zinc-500'}>
              Group {p.code}: {p.submitted? '✓' : '⏳'}
            </li>
          ))}
        </ul>
      </div>
      {result && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Top 3</h2>
          {result.options?.map((opt:any, i:number)=> (
            <div key={i} className="rounded-2xl overflow-hidden shadow bg-white">
              <div className="aspect-video bg-emerald-200 flex items-center justify-center">
                <span className="p-4 text-center text-emerald-900">{opt.destination?.name}</span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">Option {i+1}: {opt.destination?.name}</h3>
                <ul className="list-disc pl-5 text-sm">
                  {opt.reasonSummary?.slice(0,4).map((f:string,idx:number)=>(<li key={idx}>{f}</li>))}
                </ul>
                <p className="text-sm opacity-80">Trade‑offs: {opt.tradeoffs?.join('; ')}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}


