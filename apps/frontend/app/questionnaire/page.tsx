'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { GroupProfile } from '@fhp/shared';
import HolidayLoading from '../components/HolidayLoading';

const blank: GroupProfile = {
  groupId: 'A', members: [], homeAirports: [], budgetFlex: 'soft',
  earliestStart: '', earliestFlexDays: 0, latestEnd: '', latestFlexDays: 0,
  tripLengthNights: 7, pace: 'balanced', accommodationRank: [], activities: [],
  vetoes: [], mustHaves: [], travelEndurance: {}, kidNeeds: [], accessibilityNeeds: [],
  climatePref: 'mild', foodConstraints: [], togetherness: 70, privacyTolerance: 60,
  occasionGoals: [], riskTolerance: 50, flexibility: 5
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const LOCATION_TYPES = ['Beach', 'Mountains', 'Snow/Skiing', 'Big City', 'Small Town', 'National Parks', 'Islands', 'Desert', 'Forest/Lakes', 'Wine Country'];

const ACTIVITY_OPTIONS = ['Museums/Culture', 'Outdoor Adventures', 'Food & Dining', 'Nightlife', 'Shopping', 'Wildlife/Safaris', 'Water Sports', 'Hiking/Walking', 'Photography', 'Festivals/Events'];

const VETO_OPTIONS = ['Long flights (8+ hrs)', 'Extreme heat (35°C+)', 'Extreme cold', 'High altitude', 'Crowds/tourists', 'Language barriers', 'Expensive destinations', 'Remote locations', 'Political instability', 'Poor infrastructure'];

export default function Page(){
  const [profile, setProfile] = useState<GroupProfile>(blank);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [customVeto, setCustomVeto] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [locationPrefs, setLocationPrefs] = useState<string[]>([]);
  const [activityPrefs, setActivityPrefs] = useState<string[]>([]);
  const [adventurousness, setAdventurousness] = useState(3);
  const [budgetRange, setBudgetRange] = useState(3);
  const [groupDynamics, setGroupDynamics] = useState(3);

  useEffect(()=>{ (async()=>{
    const r = await api.get('/profile/me');
    if(r.data.profile) {
      const p = r.data.profile;
      setProfile(p);
      setAvailableMonths(p.occasionGoals || []);
      setLocationPrefs(p.accommodationRank || []);
      setActivityPrefs(p.activities || []);
      setAdventurousness(p.riskTolerance ? Math.round(p.riskTolerance / 20) : 3);
      setBudgetRange(p.budgetPerAdultUSD ? Math.min(5, Math.max(1, Math.round(p.budgetPerAdultUSD / 1000))) : 3);
      setGroupDynamics(p.togetherness ? Math.round(p.togetherness / 20) : 3);
    }
    setLoading(false);
  })(); },[]);

  function toggleMonth(month: string) {
    setAvailableMonths(prev => 
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  }

  function toggleLocation(location: string) {
    setLocationPrefs(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  }

  function toggleActivity(activity: string) {
    setActivityPrefs(prev => 
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  }

  function toggleVeto(veto: string) {
    setProfile(prev => ({
      ...prev,
      vetoes: prev.vetoes.includes(veto) ? prev.vetoes.filter(v => v !== veto) : [...prev.vetoes, veto]
    }));
  }

  function addCustomVeto() {
    if (customVeto.trim()) {
      setProfile(prev => ({
        ...prev,
        vetoes: [...prev.vetoes, customVeto.trim()]
      }));
      setCustomVeto('');
    }
  }

  async function save(){
    if(profile.vetoes.length < 1){
      alert('Please select at least 1 veto.'); return;
    }
    if(availableMonths.length < 1){
      alert('Please select at least 1 available month.'); return;
    }

    const updatedProfile = {
      ...profile,
      occasionGoals: availableMonths,
      accommodationRank: locationPrefs,
      activities: activityPrefs,
      riskTolerance: adventurousness * 20,
      budgetPerAdultUSD: budgetRange * 1000,
      togetherness: groupDynamics * 20,
      mustHaves: [] // Removed as covered by other fields
    };

    await api.post('/profile/upsert', { profile: updatedProfile });
    setGenerating(true);
    try{
      // Immediately generate ideas so Rank page is ready
      await api.post('/cards/generate', {});
    }catch{
      // ignore; Rank page can trigger generation if needed
    }
    window.location.href = '/rank';
  }

  if(loading) return <main className="p-8">Loading…</main>;
  if(generating) return <HolidayLoading />;

  return (
    <main className="max-w-2xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Step 1 — Family Holiday Questionnaire</h1>
        <p className="opacity-70 mt-2">Help us find the perfect holiday for everyone. Keep it quick; you can edit later.</p>
      </div>

      {/* Trip Length Slider */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">Trip length: {profile.tripLengthNights} nights</label>
        <input 
          type="range" 
          min="4" 
          max="14" 
          value={profile.tripLengthNights} 
          onChange={e=>setProfile({...profile, tripLengthNights: Number(e.target.value)})} 
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>4 days</span>
          <span>14 days</span>
        </div>
      </section>

      {/* Available Months */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">When are you available? (Select all that work)</label>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map(month => (
            <label key={month} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={availableMonths.includes(month)}
                onChange={() => toggleMonth(month)}
                className="rounded"
              />
              <span className="text-sm">{month}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Adventurousness Scale */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">Holiday style: {['Super relaxed', 'Mostly relaxed', 'Balanced', 'Quite adventurous', 'Very adventurous'][adventurousness - 1]}</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={adventurousness} 
          onChange={e=>setAdventurousness(Number(e.target.value))} 
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Relaxation</span>
          <span>Adventure</span>
        </div>
      </section>

      {/* Location Preferences */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">What locations appeal to you? (Select all that interest you)</label>
        <div className="grid grid-cols-2 gap-2">
          {LOCATION_TYPES.map(location => (
            <label key={location} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={locationPrefs.includes(location)}
                onChange={() => toggleLocation(location)}
                className="rounded"
              />
              <span className="text-sm">{location}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Activity Preferences */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">What activities interest you? (Select all that apply)</label>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_OPTIONS.map(activity => (
            <label key={activity} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={activityPrefs.includes(activity)}
                onChange={() => toggleActivity(activity)}
                className="rounded"
              />
              <span className="text-sm">{activity}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Budget Range */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">Budget range per adult: {['Budget-friendly ($1-2k)', 'Moderate ($2-3k)', 'Comfortable ($3-4k)', 'Premium ($4-5k)', 'Luxury ($5k+)'][budgetRange - 1]}</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={budgetRange} 
          onChange={e=>setBudgetRange(Number(e.target.value))} 
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Budget</span>
          <span>Luxury</span>
        </div>
      </section>

      {/* Group Dynamics */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">Family time preference: {['Lots of independent time', 'Some separate activities', 'Mix of together/apart', 'Mostly together', 'Always together'][groupDynamics - 1]}</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={groupDynamics} 
          onChange={e=>setGroupDynamics(Number(e.target.value))} 
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Independent</span>
          <span>Together</span>
        </div>
      </section>

      {/* Vetoes */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">Deal-breakers (Select any that apply)</label>
        <div className="grid grid-cols-1 gap-2">
          {VETO_OPTIONS.map(veto => (
            <label key={veto} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={profile.vetoes.includes(veto)}
                onChange={() => toggleVeto(veto)}
                className="rounded"
              />
              <span className="text-sm">{veto}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input 
            value={customVeto}
            onChange={e=>setCustomVeto(e.target.value)}
            placeholder="Add your own deal-breaker..."
            className="border rounded p-2 flex-1"
            onKeyPress={e => e.key === 'Enter' && addCustomVeto()}
          />
          <button 
            onClick={addCustomVeto}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add
          </button>
        </div>
        {profile.vetoes.filter(v => !VETO_OPTIONS.includes(v)).map(veto => (
          <div key={veto} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="text-sm">{veto}</span>
            <button 
              onClick={() => toggleVeto(veto)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* Free-form Notes */}
      <section className="space-y-3">
        <label className="block text-sm font-medium">Additional notes or special requirements</label>
        <textarea 
          value={profile.notes || ''} 
          onChange={e=>setProfile({...profile, notes: e.target.value})}
          placeholder="Anything else we should consider? Accessibility needs, dietary requirements, special occasions..."
          className="border rounded p-3 w-full h-24 resize-none"
        />
      </section>

      <button onClick={save} className="w-full rounded-xl px-4 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700">
        Save & Continue → Generate Holiday Ideas
      </button>
    </main>
  );
}


