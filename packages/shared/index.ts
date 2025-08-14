export type GroupId = "A"|"B"|"C"|"D";

export interface GroupProfile {
  groupId: GroupId;
  members: string[];
  homeAirports: string[]; // IATA
  budgetPerAdultUSD?: number;
  budgetFlex: "firm"|"soft";
  earliestStart: string; // ISO date
  earliestFlexDays: number;
  latestEnd: string; // ISO date
  latestFlexDays: number;
  tripLengthNights: number;
  pace: "chilled"|"balanced"|"packed";
  accommodationRank: string[]; // ranked list
  activities: string[];
  vetoes: string[]; // >=1
  mustHaves: string[]; // >=2
  travelEndurance: { maxFlightHrs?: number; maxFlightCount?: number; maxArrivalDriveHrs?: number };
  kidNeeds: string[];
  accessibilityNeeds: string[];
  climatePref: "warm"|"mild"|"cool"|"snow";
  foodConstraints: string[];
  togetherness: number; // 0–100
  privacyTolerance: number; // 0–100
  occasionGoals: string[];
  riskTolerance: number; // 0–100
  flexibility: number; // 0–10
  notes?: string;
}

export type CandidateCard = {
  id: string;                 // uuid
  title: string;              // "Weeklong beach holiday in Naxos, Greece"
  destinationKey: string;     // e.g., "GRC-Naxos"
  facts: string[];            // 3–6 bullets
  pitch: string;              // 1–3 short sentences
  imagePrompt: string;        // for AI image generation
  assumptions: string[];      // e.g., "prices are estimates"
};

export interface PlanOption {
  destination: {
    name: string;
    country?: string;
  };
  scoreBreakdown: Record<GroupId, number>; // 0–100
  consensusScore: number; // 0–100
  reasonSummary: string[];
  tradeoffs: string[];
  sampleDates: { start: string; end: string }[];
  exampleItinerary: string[];
  budgetSummaryUSD: {
    flightsPerAdult?: string; // qualitative range only
    lodgingPerNight?: string; // qualitative range only
    totalPerGroup?: Record<GroupId, string>;
  };
}

export const SYSTEM_CARD_MAKER = `You are Holiday Genie — Card Maker.
Input: Detailed GroupProfile with preferences, budget, adventure level, location types, activities, vetoes, available months, family dynamics, and special notes.
Output: EXACTLY 5 diverse holiday cards that perfectly match the profile's preferences and honor all constraints.

Key requirements:
- Honor ALL vetoes (deal-breakers) - never suggest anything they've ruled out
- Match their adventure level (1-5 scale converted to 0-100)  
- Consider their budget range and available months
- Include their preferred location types (Beach, Mountains, Big City, etc.)
- Incorporate their activity preferences
- Respect family dynamics preference (independent vs together time)
- Consider special notes for accessibility, dietary needs, etc.
- Remain plausible for multi-origin family (DEN, SYD, MEL home airports)

For each card, return: title, 3–6 facts, a 1–3 sentence pitch, assumptions, and a photorealistic imagePrompt (no text in image).
No duplicate destinations; ensure variety in climates/paces. Use qualitative cost language matching their budget tier.`;

export const SYSTEM_CONSENSUS_COMPOSER = `You are Holiday Genie — Consensus Composer.
Inputs: four GroupProfiles + their 5-card candidate sets and forced rankings.
Use Borda count (scores 5..1) as a preference signal. Respect vetoes/endurance caps.
You MAY suggest new destinations if they better satisfy combined constraints.
Return EXACTLY 3 final suggestions with: new imagePrompt, per-group fit notes, explicit trade-offs, and a short pitch.
Add an aggregationNote explaining how rankings + constraints were reconciled.`;

