'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { GroupProfile } from '@fhp/shared';
import HolidayLoading from '../components/HolidayLoading';
import { HolidayEmoji } from '../components/HolidayIcons';
import { HolidayProgress } from '../components/ProgressIndicator';

const blank: GroupProfile = {
  groupId: 'A', members: [], homeAirports: [], budgetFlex: 'soft',
  earliestStart: '', earliestFlexDays: 0, latestEnd: '', latestFlexDays: 0,
  tripLengthNights: 7, pace: 'balanced', accommodationRank: [], accommodationStyles: [], activities: [],
  vetoes: [], mustHaves: [], travelEndurance: {}, kidNeeds: [], accessibilityNeeds: [],
  climatePref: 'mild', foodConstraints: [], togetherness: 70, privacyTolerance: 60,
  occasionGoals: [], riskTolerance: 50, flexibility: 5
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const LOCATION_TYPES = [
  'Beach', 'Mountains', 'Snow/Skiing', 'Big City', 'Small Town', 'National Parks', 
  'Islands', 'Desert', 'Forest/Lakes', 'Wine Country', 'Countryside/farm stay', 
  'Rivers/lakeside', 'Historic town', 'Wellness/spa'
];

const ACTIVITY_OPTIONS = [
  'Museums/Culture', 'Outdoor Adventures', 'Food & Dining', 'Nightlife', 'Shopping', 
  'Wildlife/Safaris', 'Water Sports', 'Hiking/Walking', 'Photography', 'Festivals/Events',
  'Cycling', 'Sailing/boating', 'Theme parks', 'Local crafts/markets', 'Snorkeling/diving'
];

const ACCOMMODATION_STYLES = [
  'Big shared house', 'Separate rooms', 'Resort', 'Boutique hotel', 'Apartment/condo',
  'Cabin/lodge', 'Bed & breakfast', 'Villa', 'Hostel', 'Glamping', 'Farm stay'
];

const KID_NEEDS = [
  'Cot/crib', 'High chair', 'Stroller-friendly', 'Step-free access', 'Quiet area for naps',
  'Childcare services', 'Kids club', 'Safe play areas', 'Baby changing facilities',
  'Child-friendly dining', 'Car seat availability'
];

const ACCESSIBILITY_NEEDS = [
  'Wheelchair accessible', 'Step-free access', 'Elevator access', 'Accessible bathrooms',
  'Hearing assistance', 'Visual assistance', 'Mobility equipment', 'Quiet spaces',
  'Low-sensory options', 'Accessible transportation'
];

const SPORTING_EVENTS = [
  'Football/Soccer', 'Tennis', 'Golf', 'Cricket', 'Rugby', 'Baseball', 'Basketball',
  'Olympics', 'Formula 1', 'Marathon/Running', 'Cycling races', 'Sailing regattas',
  'Skiing competitions', 'Surfing competitions', 'Rock climbing', 'Swimming'
];

const VETO_OPTIONS = [
  'Long flights (8+ hrs)', 'Extreme heat (35°C+)', 'Extreme cold', 'High altitude', 
  'Crowds/tourists', 'Language barriers', 'Expensive destinations', 'Remote locations', 
  'Political instability', 'Poor infrastructure', 'No hostels', 'No overnight flights',
  'No long drives', 'No places without cot/high chair', 'No shared bathrooms',
  'No stairs only', 'No loud environments', 'No smoking areas', 'No pets allowed'
];

export default function Page(){
  const [profile, setProfile] = useState<GroupProfile>(blank);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [customVeto, setCustomVeto] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [locationPrefs, setLocationPrefs] = useState<string[]>([]);
  const [activityPrefs, setActivityPrefs] = useState<string[]>([]);
  const [accommodationPrefs, setAccommodationPrefs] = useState<string[]>([]);
  const [kidNeedsPrefs, setKidNeedsPrefs] = useState<string[]>([]);
  const [accessibilityPrefs, setAccessibilityPrefs] = useState<string[]>([]);
  const [sportingPrefs, setSportingPrefs] = useState<string[]>([]);
  const [climatePrefs, setClimatePrefs] = useState<string[]>([]);
  const [adventurousness, setAdventurousness] = useState(3);
  const [budgetRange, setBudgetRange] = useState(3);
  const [groupDynamics, setGroupDynamics] = useState(3);
  const [flexibility, setFlexibility] = useState(5);

  // Calculate progress
  const totalSections = 10;
  const completedSections = [
    profile.tripLengthNights > 0,
    availableMonths.length > 0,
    climatePrefs.length > 0,
    profile.travelEndurance.maxFlightHrs || profile.travelEndurance.maxFlightCount || profile.travelEndurance.maxArrivalDriveHrs,
    accommodationPrefs.length > 0,
    kidNeedsPrefs.length > 0,
    accessibilityPrefs.length > 0,
    adventurousness > 0,
    locationPrefs.length > 0,
    activityPrefs.length > 0,
    sportingPrefs.length > 0,
    budgetRange > 0,
    groupDynamics > 0,
    flexibility > 0,
    profile.vetoes.length > 0
  ].filter(Boolean).length;
  
  const progress = Math.round((completedSections / totalSections) * 100);

  useEffect(()=>{ (async()=>{
    const r = await api.get('/profile/me');
    if(r.data.profile) {
      const p = r.data.profile;
      setProfile(p);
      setAvailableMonths(p.occasionGoals || []);
      setLocationPrefs(p.accommodationRank || []);
      setActivityPrefs(p.activities || []);
      setAccommodationPrefs(p.accommodationStyles || []);
      setKidNeedsPrefs(p.kidNeeds || []);
      setAccessibilityPrefs(p.accessibilityNeeds || []);
      setSportingPrefs(p.activities?.filter((a: string) => SPORTING_EVENTS.includes(a)) || []);
      setClimatePrefs(p.climatePref ? [p.climatePref] : []);
      setAdventurousness(p.riskTolerance ? Math.round(p.riskTolerance / 20) : 3);
      setBudgetRange(p.budgetPerAdultUSD ? Math.min(5, Math.max(1, Math.round(p.budgetPerAdultUSD / 1000))) : 3);
      setGroupDynamics(p.togetherness ? Math.round(p.togetherness / 20) : 3);
      setFlexibility(p.flexibility || 5);
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

  function toggleAccommodation(accommodation: string) {
    setAccommodationPrefs(prev => 
      prev.includes(accommodation) ? prev.filter(a => a !== accommodation) : [...prev, accommodation]
    );
  }

  function toggleKidNeed(need: string) {
    setKidNeedsPrefs(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  }

  function toggleAccessibility(need: string) {
    setAccessibilityPrefs(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  }

  function toggleSporting(sport: string) {
    setSportingPrefs(prev => 
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  }

  function toggleClimate(climate: string) {
    setClimatePrefs(prev => 
      prev.includes(climate) ? prev.filter(c => c !== climate) : [...prev, climate]
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
      accommodationStyles: accommodationPrefs,
      activities: [...activityPrefs, ...sportingPrefs],
      kidNeeds: kidNeedsPrefs,
      accessibilityNeeds: accessibilityPrefs,
      climatePref: climatePrefs[0] || 'mild', // Keep first preference for backward compatibility
      riskTolerance: adventurousness * 20,
      budgetPerAdultUSD: budgetRange * 1000,
      togetherness: groupDynamics * 20,
      flexibility: flexibility,
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
    <div className="min-h-screen holiday-pattern">
      {/* Floating holiday elements */}
      <div className="floating-element" style={{ top: '10%', left: '5%' }}>🏖️</div>
      <div className="floating-element" style={{ top: '20%', right: '10%' }}>✈️</div>
      <div className="floating-element" style={{ bottom: '15%', left: '15%' }}>🏔️</div>
      
      <main className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* Header with progress */}
        <div className="holiday-card rounded-2xl p-8 section-fade-in">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
              Step 1 — Family Holiday Questionnaire
            </h1>
            <p className="text-lg opacity-70 mt-3">
              Help us find the perfect holiday for everyone. Keep it quick; you can edit later.
            </p>
          </div>
          
          <HolidayProgress progress={progress} />
        </div>

        {/* Trip Length Slider */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📅</span>
            <label className="text-lg font-semibold">Trip length: {profile.tripLengthNights} nights</label>
          </div>
          <input 
            type="range" 
            min="4" 
            max="14" 
            value={profile.tripLengthNights} 
            onChange={e=>setProfile({...profile, tripLengthNights: Number(e.target.value)})} 
            className="holiday-slider w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>4 days</span>
            <span>14 days</span>
          </div>
        </section>

        {/* Available Months */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🗓️</span>
            <label className="text-lg font-semibold">When are you available? (Select all that work)</label>
          </div>
          <div className="month-grid">
            {MONTHS.map(month => (
              <div
                key={month}
                className={`month-item ${availableMonths.includes(month) ? 'selected' : ''}`}
                onClick={() => toggleMonth(month)}
              >
                {month}
              </div>
            ))}
          </div>
        </section>

        {/* Climate Preference */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌤️</span>
            <label className="text-lg font-semibold">Climate preferences (Select all that appeal)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'warm', label: 'Warm (25-35°C)', desc: 'Tropical, Mediterranean', emoji: '☀️' },
              { value: 'mild', label: 'Mild (15-25°C)', desc: 'Spring/autumn weather', emoji: '🌤️' },
              { value: 'cool', label: 'Cool (5-15°C)', desc: 'Mountain, northern climates', emoji: '🌥️' },
              { value: 'snow', label: 'Snow', desc: 'Winter sports, alpine', emoji: '❄️' }
            ].map(climate => (
              <label key={climate.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={climatePrefs.includes(climate.value)}
                  onChange={() => toggleClimate(climate.value)}
                  className="holiday-checkbox"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xl">{climate.emoji}</span>
                  <div>
                    <div className="font-medium">{climate.label}</div>
                    <div className="text-sm text-gray-500">{climate.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Flight/Transfer Tolerance */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✈️</span>
            <label className="text-lg font-semibold">Flight & transfer tolerance</label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Maximum flight hours</label>
              <input 
                type="number" 
                min="1" 
                max="24" 
                value={profile.travelEndurance.maxFlightHrs || ''} 
                onChange={e=>setProfile({
                  ...profile, 
                  travelEndurance: {...profile.travelEndurance, maxFlightHrs: Number(e.target.value)}
                })} 
                placeholder="e.g., 8"
                className="holiday-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maximum number of flights</label>
              <input 
                type="number" 
                min="1" 
                max="5" 
                value={profile.travelEndurance.maxFlightCount || ''} 
                onChange={e=>setProfile({
                  ...profile, 
                  travelEndurance: {...profile.travelEndurance, maxFlightCount: Number(e.target.value)}
                })} 
                placeholder="e.g., 2"
                className="holiday-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maximum arrival drive (hours)</label>
              <input 
                type="number" 
                min="0" 
                max="8" 
                value={profile.travelEndurance.maxArrivalDriveHrs || ''} 
                onChange={e=>setProfile({
                  ...profile, 
                  travelEndurance: {...profile.travelEndurance, maxArrivalDriveHrs: Number(e.target.value)}
                })} 
                placeholder="e.g., 2"
                className="holiday-input w-full"
              />
            </div>
          </div>
        </section>

        {/* Accommodation Style */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏨</span>
            <label className="text-lg font-semibold">Accommodation style (Select all that appeal)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACCOMMODATION_STYLES.map(style => (
              <label key={style} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={accommodationPrefs.includes(style)}
                  onChange={() => toggleAccommodation(style)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{style}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Kid Needs */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👶</span>
            <label className="text-lg font-semibold">Kid/Accessibility needs (Select all that apply)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {KID_NEEDS.map(need => (
              <label key={need} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={kidNeedsPrefs.includes(need)}
                  onChange={() => toggleKidNeed(need)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{need}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Accessibility Needs */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">♿</span>
            <label className="text-lg font-semibold">Accessibility requirements (Select all that apply)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACCESSIBILITY_NEEDS.map(need => (
              <label key={need} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={accessibilityPrefs.includes(need)}
                  onChange={() => toggleAccessibility(need)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{need}</span>
              </label>
            ))}
          </div>
        </section>





        {/* Adventurousness Scale */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏃‍♂️</span>
            <label className="text-lg font-semibold">
              Holiday style: {['Super relaxed', 'Mostly relaxed', 'Balanced', 'Quite adventurous', 'Very adventurous'][adventurousness - 1]}
            </label>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={adventurousness} 
            onChange={e=>setAdventurousness(Number(e.target.value))} 
            className="holiday-slider w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Relaxation</span>
            <span>Adventure</span>
          </div>
        </section>

        {/* Location Preferences */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🗺️</span>
            <label className="text-lg font-semibold">What locations appeal to you? (Select all that interest you)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LOCATION_TYPES.map(location => (
              <label key={location} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={locationPrefs.includes(location)}
                  onChange={() => toggleLocation(location)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{location}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Activity Preferences */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <label className="text-lg font-semibold">What activities interest you? (Select all that apply)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACTIVITY_OPTIONS.map(activity => (
              <label key={activity} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={activityPrefs.includes(activity)}
                  onChange={() => toggleActivity(activity)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{activity}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Sporting Events */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚽</span>
            <label className="text-lg font-semibold">What sporting events interest you? (Select all that apply)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SPORTING_EVENTS.map(sport => (
              <label key={sport} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={sportingPrefs.includes(sport)}
                  onChange={() => toggleSporting(sport)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{sport}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Budget Range */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💰</span>
            <label className="text-lg font-semibold">
              Budget range per adult: {['Budget-friendly ($1-2k)', 'Moderate ($2-3k)', 'Comfortable ($3-4k)', 'Premium ($4-5k)', 'Luxury ($5k+)'][budgetRange - 1]}
            </label>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={budgetRange} 
            onChange={e=>setBudgetRange(Number(e.target.value))} 
            className="holiday-slider w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Budget</span>
            <span>Luxury</span>
          </div>
        </section>

        {/* Group Dynamics */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <label className="text-lg font-semibold">
              Family time preference: {['Lots of independent time', 'Some separate activities', 'Mix of together/apart', 'Mostly together', 'Always together'][groupDynamics - 1]}
            </label>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={groupDynamics} 
            onChange={e=>setGroupDynamics(Number(e.target.value))} 
            className="holiday-slider w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Independent</span>
            <span>Together</span>
          </div>
        </section>

        {/* Flexibility Score */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎭</span>
            <label className="text-lg font-semibold">
              Flexibility score: {['Very rigid', 'Somewhat rigid', 'Moderate', 'Somewhat flexible', 'Very flexible'][Math.round(flexibility / 2) - 1]}
            </label>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={flexibility} 
            onChange={e=>setFlexibility(Number(e.target.value))} 
            className="holiday-slider w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Rigid</span>
            <span>Flexible</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">How willing are you to compromise on preferences?</p>
        </section>

        {/* Vetoes */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🚫</span>
            <label className="text-lg font-semibold">Deal-breakers (Select any that apply)</label>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {VETO_OPTIONS.map(veto => (
              <label key={veto} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={profile.vetoes.includes(veto)}
                  onChange={() => toggleVeto(veto)}
                  className="holiday-checkbox"
                />
                <span className="text-sm">{veto}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <input 
              value={customVeto}
              onChange={e=>setCustomVeto(e.target.value)}
              placeholder="Add your own deal-breaker..."
              className="holiday-input flex-1"
              onKeyPress={e => e.key === 'Enter' && addCustomVeto()}
            />
            <button 
              onClick={addCustomVeto}
              className="holiday-button px-6"
            >
              Add
            </button>
          </div>
          {profile.vetoes.filter(v => !VETO_OPTIONS.includes(v)).map(veto => (
            <div key={veto} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-3">
              <span className="text-sm">{veto}</span>
              <button 
                onClick={() => toggleVeto(veto)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Free-form Notes */}
        <section className="holiday-card rounded-2xl p-6 section-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📝</span>
            <label className="text-lg font-semibold">Additional notes or special requirements</label>
          </div>
          <textarea 
            value={profile.notes || ''} 
            onChange={e=>setProfile({...profile, notes: e.target.value})}
            placeholder="Anything else we should consider? Special occasions, accessibility needs, dietary requirements..."
            className="holiday-input w-full h-32 resize-none"
          />
        </section>

        {/* Save Button */}
        <div className="text-center section-fade-in">
          <button onClick={save} className="holiday-button text-lg px-8 py-4">
            🎉 Save & Continue → Generate Holiday Ideas
          </button>
        </div>
      </main>
    </div>
  );
}


