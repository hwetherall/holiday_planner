import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend directory (go up from src to backend root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });
console.log('Loading .env from:', path.join(__dirname, '..', '.env'));
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import OpenAI from 'openai';
import { SYSTEM_CARD_MAKER, SYSTEM_CONSENSUS_COMPOSER, GroupProfile, CandidateCard } from '@fhp/shared';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.ALLOW_ORIGIN?.split(',') ?? '*', credentials: true }));

// Health check endpoint for Railway
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
console.log('Initializing OpenRouter with key:', openRouterApiKey ? `sk-...${openRouterApiKey.slice(-4)}` : 'NOT SET');
const ai: OpenAI | null = openRouterApiKey ? new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: openRouterApiKey,
}) : null;
console.log('OpenRouter client initialized:', !!ai);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req: Request, res: Response, next: NextFunction){
  const h = req.headers.authorization; if(!h) return res.status(401).json({error:'no auth'});
  try{ const t = h.split(' ')[1]; (req as any).user = jwt.verify(t, JWT_SECRET); next(); }catch{ return res.status(401).json({error:'bad token'}); }
}

// --- Auth ---
app.post('/auth/login', async (req: Request, res: Response) => {
  const { groupCode, pin } = req.body as { groupCode: string, pin: string };
  const group = await prisma.group.findUnique({ where: { code: groupCode } });
  if (!group) return res.status(404).json({ error: 'group not found' });
  const ok = await bcrypt.compare(String(pin), group.pinHash);
  if (!ok) return res.status(401).json({ error: 'invalid pin' });
  const token = jwt.sign({ groupId: group.id, groupCode }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, group: { id: group.id, code: group.code, name: group.name } });
});

// --- Profile ---
app.post('/profile/upsert', auth, async (req: Request, res: Response) => {
  const { profile } = req.body as { profile: GroupProfile };
  const groupId = (req as any).user.groupId as string;
  const saved = await prisma.profile.upsert({
    where: { groupId },
    update: { profileJson: profile as any },
    create: { groupId, profileJson: profile as any }
  });
  res.json({ ok: true, profile: saved.profileJson });
});

app.get('/profile/me', auth, async (req: Request, res: Response) => {
  const groupId = (req as any).user.groupId as string;
  const p = await prisma.profile.findFirst({ where: { groupId } });
  res.json({ profile: p?.profileJson ?? null });
});

// --- Shared Veto Options ---
app.get('/veto-options', async (req: Request, res: Response) => {
  try {
    const sharedVetos = await prisma.sharedVetoOption.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ vetoOptions: sharedVetos.map(v => v.vetoText) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch veto options' });
  }
});

app.post('/veto-options', auth, async (req: Request, res: Response) => {
  try {
    const { vetoText } = req.body as { vetoText: string };
    const groupCode = (req as any).user.groupCode as string;
    
    if (!vetoText || vetoText.trim().length === 0) {
      return res.status(400).json({ error: 'Veto text is required' });
    }
    
    const trimmedVeto = vetoText.trim();
    
    // Check if it already exists
    const existing = await prisma.sharedVetoOption.findUnique({
      where: { vetoText: trimmedVeto }
    });
    
    if (existing) {
      return res.status(409).json({ error: 'Veto option already exists' });
    }
    
    // Add the new veto option
    const newVeto = await prisma.sharedVetoOption.create({
      data: {
        vetoText: trimmedVeto,
        addedBy: groupCode
      }
    });
    
    res.json({ vetoOption: newVeto });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add veto option' });
  }
});

// --- Shared Activity Options ---
app.get('/activity-options', async (req: Request, res: Response) => {
  try {
    const sharedActivities = await prisma.sharedActivityOption.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ activityOptions: sharedActivities.map(a => a.activityText) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity options' });
  }
});

app.post('/activity-options', auth, async (req: Request, res: Response) => {
  try {
    const { activityText } = req.body as { activityText: string };
    const groupCode = (req as any).user.groupCode as string;
    
    if (!activityText || activityText.trim().length === 0) {
      return res.status(400).json({ error: 'Activity text is required' });
    }
    
    const trimmedActivity = activityText.trim();
    
    // Check if it already exists
    const existing = await prisma.sharedActivityOption.findUnique({
      where: { activityText: trimmedActivity }
    });
    
    if (existing) {
      return res.status(409).json({ error: 'Activity option already exists' });
    }
    
    // Add the new activity option
    const newActivity = await prisma.sharedActivityOption.create({
      data: {
        activityText: trimmedActivity,
        addedBy: groupCode
      }
    });
    
    res.json({ activityOption: newActivity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add activity option' });
  }
});

// --- Shared Location Options ---
app.get('/location-options', async (req: Request, res: Response) => {
  try {
    const sharedLocations = await prisma.sharedLocationOption.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ locationOptions: sharedLocations.map(l => l.locationText) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location options' });
  }
});

app.post('/location-options', auth, async (req: Request, res: Response) => {
  try {
    const { locationText } = req.body as { locationText: string };
    const groupCode = (req as any).user.groupCode as string;
    
    if (!locationText || locationText.trim().length === 0) {
      return res.status(400).json({ error: 'Location text is required' });
    }
    
    const trimmedLocation = locationText.trim();
    
    // Check if it already exists
    const existing = await prisma.sharedLocationOption.findUnique({
      where: { locationText: trimmedLocation }
    });
    
    if (existing) {
      return res.status(409).json({ error: 'Location option already exists' });
    }
    
    // Add the new location option
    const newLocation = await prisma.sharedLocationOption.create({
      data: {
        locationText: trimmedLocation,
        addedBy: groupCode
      }
    });
    
    res.json({ locationOption: newLocation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add location option' });
  }
});

// --- Cards: generate 5 ---
app.post('/cards/generate', auth, async (req: Request, res: Response) => {
  console.log('=== CARDS GENERATE ENDPOINT HIT ===');
  const groupId = (req as any).user.groupId as string;
  console.log('Group ID:', groupId);
  
  const p = await prisma.profile.findFirst({ where: { groupId } });
  console.log('Profile found:', !!p);
  if(!p) return res.status(400).json({ error: 'no profile yet' });

  console.log('AI client status:', ai ? 'initialized' : 'not initialized');
  console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
  console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);

  let cards: CandidateCard[] = [];
  if (!ai) {
    // Mock cards when OPENAI_API_KEY is not set
    cards = [
      {
        id: uuid(),
        title: 'Beach week in Naxos, Greece',
        destinationKey: 'GRC-Naxos',
        facts: ['Family-friendly beaches', 'Walkable old town', 'Ferries from Athens'],
        pitch: 'Slow days on sandy beaches and simple Greek food. Great for mixed ages.',
        imagePrompt: 'Photorealistic coastal village in Naxos, Greece, golden hour, teal water, whitewashed houses',
        assumptions: ['Costs are indicative only']
      },
      {
        id: uuid(),
        title: 'Alpine lakes and cabins — Queenstown',
        destinationKey: 'NZL-Queenstown',
        facts: ['Lake Wakatipu views', 'Day trips to Arrowtown', 'Gondola + easy walks'],
        pitch: 'Cosy base with gentle adventures and postcard views.',
        imagePrompt: 'Photorealistic alpine lake near Queenstown, wooden cabin, snow-capped peaks, winter sun',
        assumptions: ['Weather can vary in shoulder seasons']
      },
      {
        id: uuid(),
        title: 'Tropical rainforest & reef — Cairns/Port Douglas',
        destinationKey: 'AUS-PortDouglas',
        facts: ['Great Barrier Reef access', 'Daintree rainforest', 'Resort-style pools'],
        pitch: 'Easy tropical escape with options for reef or rainforest days.',
        imagePrompt: 'Photorealistic tropical beach near Port Douglas with palm trees and coral blue water',
        assumptions: ['Stinger season requires precautions']
      },
      {
        id: uuid(),
        title: 'City + nature — Vancouver & Whistler combo',
        destinationKey: 'CAN-Vancouver-Whistler',
        facts: ['Sea-to-Sky Highway', 'Family bike paths', 'Gondola viewpoints'],
        pitch: 'Mix urban food with forest walks and mountain vistas.',
        imagePrompt: 'Photorealistic view of Vancouver skyline with mountains, blue sky, Stanley Park seawall',
        assumptions: ['Driving times vary with traffic']
      },
      {
        id: uuid(),
        title: 'Culture and coast — Lisbon & Cascais',
        destinationKey: 'PRT-Lisbon-Cascais',
        facts: ['Trams and tiled streets', 'Day trip to Sintra', 'Atlantic beaches'],
        pitch: 'Sunny city break with easy seaside day trips and great food.',
        imagePrompt: 'Photorealistic Lisbon Alfama rooftops at sunset with yellow tram and river view',
        assumptions: ['Hills and cobblestones in old quarters']
      }
    ];
  } else {
    // AI call with enhanced profile data
    console.log('Generating AI cards for profile:', JSON.stringify(p.profileJson, null, 2));
    
    const userPrompt = `Generate 5 diverse holiday suggestions based on this detailed family profile. Return JSON format: {"cards": CandidateCard[5]}.

GroupProfile data:
${JSON.stringify(p.profileJson, null, 2)}

Focus on:
- Trip length: ${(p.profileJson as any).tripLengthNights} nights
- Available months: ${((p.profileJson as any).occasionGoals || []).join(', ')}
- Budget range: ${(p.profileJson as any).budgetPerAdultUSD ? `$${(p.profileJson as any).budgetPerAdultUSD}` : 'flexible'}
- Adventure level: ${(p.profileJson as any).riskTolerance}/100
- Climate preference: ${(p.profileJson as any).climatePref || 'mild'}
- Location preferences: ${((p.profileJson as any).accommodationRank || []).join(', ')}
- Activities: ${((p.profileJson as any).activities || []).join(', ')}
- Accommodation styles: ${((p.profileJson as any).accommodationStyles || []).join(', ')}
- Kid needs: ${((p.profileJson as any).kidNeeds || []).join(', ')}
- Accessibility needs: ${((p.profileJson as any).accessibilityNeeds || []).join(', ')}
- Occasion/purpose: ${((p.profileJson as any).occasionGoals || []).join(', ')}
- Food constraints: ${((p.profileJson as any).foodConstraints || []).join(', ')}
- Travel endurance: Max ${(p.profileJson as any).travelEndurance?.maxFlightHrs || 'unlimited'}hrs flying, ${(p.profileJson as any).travelEndurance?.maxFlightCount || 'unlimited'} flights, ${(p.profileJson as any).travelEndurance?.maxArrivalDriveHrs || 'unlimited'}hrs drive
- Deal-breakers: ${((p.profileJson as any).vetoes || []).join(', ')}
- Family dynamics: ${(p.profileJson as any).togetherness}/100 (togetherness preference)
- Flexibility score: ${(p.profileJson as any).flexibility || 5}/10
- Special notes: ${(p.profileJson as any).notes || 'None'}

Ensure suggestions honor all vetoes and match the specified preferences. Consider climate, accessibility, kid needs, and food constraints carefully.`;

    const completion = await ai.chat.completions.create(
      {
        model: 'meta-llama/llama-4-maverick',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_CARD_MAKER },
          { role: 'user', content: userPrompt }
        ]
      },
      {
        headers: {
          'HTTP-Referer': process.env.ALLOW_ORIGIN || 'http://localhost:3000',
          'X-Title': 'Holiday Planner'
        }
      }
    );
    const json = JSON.parse(completion.choices[0].message.content || '{"cards":[]}');
    cards = (json.cards || []).map((c: any) => ({ ...c, id: c.id || uuid() }));
    console.log('Generated AI cards:', cards.map(c => c.title));
  }

  // Optional image attachment via provider (Unsplash or fallback)
  if(process.env.USE_IMAGE_GEN === 'true'){
    const provider = (process.env.IMAGE_PROVIDER || 'unsplash').toLowerCase();
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    console.log('[images] provider=', provider, 'unsplashKeyPresent=', Boolean(unsplashKey));
    for(const c of cards){
      const query = encodeURIComponent(`${c.title} ${c.destinationKey}`);
      try{
        if(provider === 'unsplash' && unsplashKey){
          const resp = await fetch(`https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`, {
            headers: { Authorization: `Client-ID ${unsplashKey}` }
          });
          const data = await resp.json() as any;
          const url = (data as any)?.results?.[0]?.urls?.regular as string | undefined;
          if(url){ (c as any).imageUrl = url; console.log('[images] matched', c.title, '->', url); continue; }
        }
        // Fallback: source.unsplash without key (best-effort) or picsum-like placeholder by query
        (c as any).imageUrl = `https://source.unsplash.com/featured/1280x720/?${query}`;
        console.log('[images] fallback used for', c.title);
      }catch{
        // ignore - leave without imageUrl
      }
    }
  }

  const saved = await prisma.candidateSet.create({ data: { groupId, cardsJson: { cards } } });
  res.json({ candidateSetId: saved.id, cards });
});

app.get('/cards/latest', auth, async (req: Request, res: Response) => {
  const groupId = (req as any).user.groupId as string;
  const set = await prisma.candidateSet.findFirst({ where: { groupId }, orderBy: { createdAt: 'desc' } });
  res.json({ candidateSetId: set?.id, cards: (set?.cardsJson as any)?.cards ?? [] });
});

// --- Ranking submit ---
app.post('/ranking/submit', auth, async (req: Request, res: Response) => {
  const { candidateSetId, ranking } = req.body as { candidateSetId: string, ranking: Record<string, number> };
  const groupId = (req as any).user.groupId as string;
  // Validate forced ranking 1..5
  const ranks = Object.values(ranking);
  const valid = ranks.length === 5 && new Set(ranks).size === 5 && ranks.every(n => [1,2,3,4,5].includes(Number(n)));
  if(!valid) return res.status(400).json({ error: 'ranking must be 1..5 without ties' });
  await prisma.ranking.create({ data: { groupId, candidateSetId, ranking } });
  res.json({ ok: true });
});

// --- Progress ---
app.get('/status/progress', async (_req: Request, res: Response) => {
  const groups = await prisma.group.findMany({ select: { id: true, code: true } });
  const latestByGroup = await Promise.all(groups.map(async g => {
    const r = await prisma.ranking.findFirst({ where: { groupId: g.id }, orderBy: { createdAt: 'desc' } });
    return { code: g.code, submitted: Boolean(r) };
  }));
  res.json({ progress: latestByGroup });
});

// --- Consensus (after all 4) ---
app.post('/consensus/generate', async (_req: Request, res: Response) => {
  const groups = await prisma.group.findMany();
  const allProfiles = await prisma.profile.findMany();
  const allRankings = await prisma.ranking.findMany({ include: { candidateSet: true } });
  if(groups.length < 4 || allProfiles.length < 4 || allRankings.length < 4){
    return res.status(400).json({ error: 'all groups must submit profile and ranking' });
  }
  const brief = {
    groups: groups.map(g => {
      const p = allProfiles.find(p=>p.groupId===g.id)!;
      return p.profileJson;
    })
  };
  const rankingBundle = allRankings.map(r => ({
    groupCode: groups.find(g=>g.id===r.groupId)!.code,
    candidateSet: r.candidateSet.cardsJson,
    ranking: r.ranking
  }));

  if (!ai) {
    const result: any = {
      detectedConflicts: [],
      options: [
        { destination: { name: 'Naxos, Greece' }, reasonSummary: ['Good weather match'], tradeoffs: ['Ferry transfers'] },
        { destination: { name: 'Queenstown, NZ' }, reasonSummary: ['Scenery + activities'], tradeoffs: ['Cooler temps'] },
        { destination: { name: 'Lisbon & Cascais' }, reasonSummary: ['City + beach mix'], tradeoffs: ['Hills/cobbles'] }
      ],
      aggregationNote: 'Mock consensus due to missing OPENAI_API_KEY',
      nextSteps: ['Pick dates', 'Hold refundable lodging']
    };
    const plan = await prisma.finalPlan.create({ data: { briefJson: { brief, rankingBundle }, resultJson: result } });
    return res.json({ finalPlanId: plan.id, result });
  }

  const userPrompt = JSON.stringify({ brief, rankingBundle });
  const completion = await (ai as OpenAI).chat.completions.create(
    {
      model: 'meta-llama/llama-4-maverick',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_CONSENSUS_COMPOSER },
        { role: 'user', content: `Return JSON with keys: detectedConflicts, options (PlanOption[3]), aggregationNote, nextSteps. Input follows as JSON.
${userPrompt}` }
      ]
    },
    {
      headers: {
        'HTTP-Referer': process.env.ALLOW_ORIGIN || 'http://localhost:3000',
        'X-Title': 'Holiday Planner'
      }
    }
  );
  const result = JSON.parse(completion.choices[0].message.content || '{}');
  const plan = await prisma.finalPlan.create({ data: { briefJson: { brief, rankingBundle }, resultJson: result } });
  res.json({ finalPlanId: plan.id, result });
});

app.get('/consensus/latest', async (_req: Request, res: Response) => {
  const plan = await prisma.finalPlan.findFirst({ orderBy: { createdAt: 'desc' } });
  res.json({ finalPlanId: plan?.id, result: plan?.resultJson ?? null });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Backend listening on :${port}`));


