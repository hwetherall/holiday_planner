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

  const submittedCount = progress.filter(p => p.submitted).length;
  const totalCount = progress.length;
  const progressPercent = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen holiday-pattern">
      {/* Floating holiday elements */}
      <div className="floating-element" style={{ top: '8%', left: '8%' }}>🏆</div>
      <div className="floating-element" style={{ top: '12%', right: '8%' }}>🎉</div>
      <div className="floating-element" style={{ bottom: '12%', left: '12%' }}>✨</div>
      
      <main className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="holiday-card rounded-2xl p-8 section-fade-in">
          <div className="text-center">
            <div className="text-4xl mb-4">🎊</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
              Step 3 — Final Suggestions
            </h1>
            <p className="text-lg opacity-70 mt-3">
              Your perfect family holiday awaits! Here are the top recommendations based on everyone's preferences.
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-semibold">Submission Progress</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {submittedCount} of {totalCount} groups submitted
              </span>
              <span className="text-sm text-gray-500">{progressPercent}% Complete</span>
            </div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {progress.map(p => (
              <div 
                key={p.code} 
                className={`p-4 rounded-lg text-center transition-all ${
                  p.submitted 
                    ? 'bg-emerald-100 border-2 border-emerald-300' 
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">
                  {p.submitted ? '✅' : '⏳'}
                </div>
                <div className={`font-semibold ${
                  p.submitted ? 'text-emerald-700' : 'text-gray-500'
                }`}>
                  Group {p.code}
                </div>
                <div className="text-sm text-gray-600">
                  {p.submitted ? 'Submitted' : 'Waiting'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="section-fade-in">
            <div className="holiday-card rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏆</span>
                <h2 className="text-2xl font-bold">Your Top 3 Holiday Destinations</h2>
              </div>
              <p className="text-gray-600">
                Based on everyone's preferences and rankings, here are the perfect destinations for your family!
              </p>
            </div>

            <div className="space-y-6">
              {result.options?.map((opt: any, i: number) => (
                <div 
                  key={i} 
                  className="holiday-card rounded-2xl overflow-hidden section-fade-in"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="aspect-video bg-gradient-to-br from-emerald-200 to-orange-200 relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🗺️</div>
                        <span className="text-2xl font-bold text-emerald-900">
                          {opt.destination?.name}
                        </span>
                      </div>
                    </div>
                    {/* Rank badge */}
                    <div className="absolute top-4 left-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-emerald-600">#{i + 1}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Option {i + 1}: {opt.destination?.name}
                      </h3>
                      {i === 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          🥇 Top Choice
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          Why this destination?
                        </h4>
                        <ul className="space-y-2">
                          {opt.reasonSummary?.slice(0, 4).map((f: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-orange-800 mb-2">
                          ⚖️ Trade-offs to consider:
                        </h4>
                        <p className="text-sm text-orange-700">
                          {opt.tradeoffs?.join('; ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Celebration section */}
            <div className="holiday-card rounded-2xl p-8 text-center section-fade-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Congratulations!
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                You've successfully found your perfect family holiday destinations. 
                Time to start planning your adventure!
              </p>
              <button 
                onClick={() => window.location.href = '/questionnaire'}
                className="holiday-button text-lg px-8 py-4"
              >
                🏠 Start Over with New Preferences
              </button>
            </div>
          </div>
        )}

        {/* Loading state for results */}
        {!result && submittedCount === totalCount && (
          <div className="holiday-card rounded-2xl p-8 text-center section-fade-in">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generating Your Perfect Holiday Suggestions
            </h3>
            <p className="text-gray-600">
              We're analyzing everyone's preferences to find the best destinations for your family...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


