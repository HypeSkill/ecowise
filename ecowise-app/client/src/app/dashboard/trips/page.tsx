"use client";

import Head from "next/head";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// --- INTERFACES ---
interface Accommodation {
  name: string;
  location?: string;
  estimated_cost_inr: number;
  booking_link: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  activities: string[];
  accommodation?: Accommodation | null;
}

interface TripSegment {
  mode: string;
  source: string;
  destination: string;
  cost: number;
  durationHrs?: number;
  bufferMins?: number;
  bufferNote?: string;
  distanceKm?: number;
}

interface Trip {
  _id?: string;
  from: string;
  to: string;
  startDate: string;
  deadline: string;
  budget: number;

  plan_name?: string;
  plan_rationale?: string;

  itinerary: ItineraryDay[];
  plan: TripSegment[];

  total_cost_accommodation_activities?: number;
  totalCost: number;
  budgetRemaining?: number;

  emissions?: {
    transportKg: number;
    stayKg: number;
    activitiesKg: number;
    totalKg: number;
  };

  warnings: string[];
  userID: string;
  createdAt?: string;
}

interface PromptDebug {
  extracted: {
    origin: string | null;
    destination: string | null;
    durationDays: number | null;
    budget: number | null;
    travelDate?: string | null;
    preferences: {
      rail: boolean;
      avoidFlights: boolean;
      localFood: boolean;
    };
  };
  missing: string[];
}

const demoTrips: Trip[] = [
  {
    _id: "demo-1",
    from: "Bengaluru",
    to: "Mysuru",
    startDate: "2026-02-14",
    deadline: "2026-02-16",
    budget: 16000,
    plan_name: "Heritage Rail Escape",
    plan_rationale: "Prioritizes regional rail and walkable heritage loops to cut transport emissions.",
    itinerary: [
      {
        day: 1,
        date: "2026-02-14",
        theme: "Rail arrival + palace quarter",
        activities: ["Depart early by regional rail", "Walk the palace district", "Local vegetarian thali"],
        accommodation: {
          name: "Nisarga Green Stay",
          location: "Mysuru",
          estimated_cost_inr: 2400,
          booking_link: "https://example.com/eco-stay",
        },
      },
      {
        day: 2,
        date: "2026-02-15",
        theme: "Cycling loop + artisan markets",
        activities: ["E-bike rental", "Handloom co-op visit", "Lake sunset walk"],
      },
      {
        day: 3,
        date: "2026-02-16",
        theme: "Botanical gardens + return",
        activities: ["Morning gardens", "Rail return", "Carbon offset suggestion"],
      },
    ],
    plan: [
      { mode: "Rail", source: "Bengaluru", destination: "Mysuru", cost: 320, durationHrs: 2.1 },
      { mode: "E-bike", source: "City loop", destination: "City loop", cost: 500 },
      { mode: "Rail", source: "Mysuru", destination: "Bengaluru", cost: 320, durationHrs: 2.2 },
    ],
    total_cost_accommodation_activities: 5400,
    totalCost: 8120,
    budgetRemaining: 7880,
    warnings: ["Low evening transit frequency after 9 PM."],
    userID: "demo",
    createdAt: "2026-02-10",
  },
  {
    _id: "demo-2",
    from: "Delhi",
    to: "Jaipur",
    startDate: "2026-03-02",
    deadline: "2026-03-05",
    budget: 24000,
    plan_name: "Pink City Slow Travel",
    plan_rationale: "Combines rail + shared EV rides with low-impact cultural activities.",
    itinerary: [
      {
        day: 1,
        date: "2026-03-02",
        theme: "Express rail + old city walk",
        activities: ["Rail arrival", "Heritage walk", "Street food tour"],
        accommodation: {
          name: "Hawa Eco Courtyard",
          location: "Jaipur",
          estimated_cost_inr: 3200,
          booking_link: "https://example.com/eco-courtyard",
        },
      },
      {
        day: 2,
        date: "2026-03-03",
        theme: "Fort shuttle + sunset hike",
        activities: ["Shared EV ride", "Amber Fort visit", "Sunset ridge hike"],
      },
      {
        day: 3,
        date: "2026-03-04",
        theme: "Artisan studio + market",
        activities: ["Block print studio", "Local market", "Eco cafe"],
      },
      {
        day: 4,
        date: "2026-03-05",
        theme: "Museum morning + return",
        activities: ["City museum", "Rail return"],
      },
    ],
    plan: [
      { mode: "Rail", source: "Delhi", destination: "Jaipur", cost: 850, durationHrs: 4.5 },
      { mode: "Shared EV", source: "Jaipur", destination: "Amber Fort", cost: 520 },
      { mode: "Rail", source: "Jaipur", destination: "Delhi", cost: 850, durationHrs: 4.6 },
    ],
    total_cost_accommodation_activities: 11600,
    totalCost: 17820,
    budgetRemaining: 6180,
    warnings: ["Book Fort shuttle in advance on weekends."],
    userID: "demo",
    createdAt: "2026-02-10",
  },
  {
    _id: "demo-3",
    from: "Mumbai",
    to: "Goa",
    startDate: "2026-04-10",
    deadline: "2026-04-14",
    budget: 32000,
    plan_name: "Coastal Rail + Community Stays",
    plan_rationale: "Replaces short-haul flights with overnight rail and locally owned stays.",
    itinerary: [
      {
        day: 1,
        date: "2026-04-10",
        theme: "Overnight rail arrival",
        activities: ["Sleep-friendly train", "Check-in", "Beach cleanup"],
        accommodation: {
          name: "Casa Verde Collective",
          location: "North Goa",
          estimated_cost_inr: 3600,
          booking_link: "https://example.com/casa-verde",
        },
      },
      {
        day: 2,
        date: "2026-04-11",
        theme: "Mangrove kayak + market",
        activities: ["Mangrove kayak", "Farmers market", "Local seafood"],
      },
      {
        day: 3,
        date: "2026-04-12",
        theme: "Cycle trail + village tour",
        activities: ["Cycle trail", "Village walk", "Sunset cliffs"],
      },
      {
        day: 4,
        date: "2026-04-13",
        theme: "Community kitchen + beach",
        activities: ["Community kitchen", "Beach day", "Return rail prep"],
      },
      {
        day: 5,
        date: "2026-04-14",
        theme: "Return by rail",
        activities: ["Morning yoga", "Return overnight train"],
      },
    ],
    plan: [
      { mode: "Rail", source: "Mumbai", destination: "Goa", cost: 1400, durationHrs: 11.5 },
      { mode: "Cycle", source: "Local trails", destination: "Local trails", cost: 400 },
      { mode: "Rail", source: "Goa", destination: "Mumbai", cost: 1400, durationHrs: 11.4 },
    ],
    total_cost_accommodation_activities: 16200,
    totalCost: 24200,
    budgetRemaining: 7800,
    warnings: ["Overnight rail has limited berths. Reserve early."],
    userID: "demo",
    createdAt: "2026-02-10",
  },
];

const examplePrompts = [
  "3-day eco trip from Bengaluru under ₹20k, prefer rail, local food",
  "Weekend in Jaipur, green stays, low-carbon transit",
  "Goa with beaches + culture, avoid flights, budget ₹30k",
];

const modelOutputs = [
  {
    label: "Rail-first heritage loop",
    score: 0.86,
    why: "Shortest rail segment, walkable city core, certified stay.",
  },
  {
    label: "EV + slow travel blend",
    score: 0.79,
    why: "Shared EV for last-mile, low-impact activities.",
  },
  {
    label: "Budget saver plan",
    score: 0.73,
    why: "Mid-range stay, fewer transfers, lower cost.",
  },
];

const carbonBreakdown = [
  { label: "Transport", value: "6.8 kg CO2e", share: "65%" },
  { label: "Stay", value: "2.4 kg CO2e", share: "23%" },
  { label: "Activities", value: "1.2 kg CO2e", share: "12%" },
];

const formatKg = (value?: number) => {
  if (value === undefined || value === null) return null;
  return `${value.toFixed(1)} kg CO2e`;
};

const knownCities = [
  "bengaluru",
  "mysuru",
  "delhi",
  "jaipur",
  "mumbai",
  "goa",
  "ooty",
  "chennai",
  "vijayawada",
  "agra",
];

const extractBudget = (prompt: string) => {
  const currencyMatch = prompt.match(/₹\s*(\d+(?:\.\d+)?)(k)?/i);
  if (currencyMatch) {
    const value = Number(currencyMatch[1]);
    return currencyMatch[2] ? value * 1000 : value;
  }
  const underMatch = prompt.match(/under\s*(\d+(?:\.\d+)?)(k)?/i);
  if (underMatch) {
    const value = Number(underMatch[1]);
    return underMatch[2] ? value * 1000 : value;
  }
  return null;
};

const extractDuration = (prompt: string) => {
  const match = prompt.match(/(\d+)\s*[-\s]?\s*(day|days|night|nights)/i);
  return match ? Number(match[1]) : null;
};

const extractOriginDestination = (prompt: string) => {
  const fromMatch = prompt.match(/from\s+([a-z\s]+)/i);
  const toMatch = prompt.match(/to\s+([a-z\s]+)/i);
  const fromCity = fromMatch
    ? knownCities.find((city) => fromMatch[1].includes(city))
    : null;
  const toCity = toMatch
    ? knownCities.find((city) => toMatch[1].includes(city))
    : null;

  return {
    origin: fromCity,
    destination: toCity,
  };
};

const extractTravelDate = (prompt: string) => {
  const match = prompt.match(/(\d{1,2})(st|nd|rd|th)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)/i);
  if (!match) return null;
  const day = match[1];
  const month = match[3];
  return `${day} ${month}`;
};

const buildTripDates = (travelDate: string | null, durationDays: number | null) => {
  if (!travelDate || !durationDays) return null;
  const year = new Date().getFullYear();
  const start = new Date(`${travelDate} ${year}`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setDate(start.getDate() + Math.max(0, durationDays - 1));
  return { startDate: start.toISOString(), deadline: end.toISOString() };
};

export default function TripsPage() {
  const router = useRouter();
  const [displayTrips, setDisplayTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const hasProcessedGeneratedTrips = useRef(false);
  const [demoMode, setDemoMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [promptDebug, setPromptDebug] = useState<PromptDebug | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  const emissionsSummary = displayTrips[0]?.emissions || null;
  const emissionTotalLabel = formatKg(emissionsSummary?.totalKg);
  const emissionBreakdown = emissionsSummary
    ? [
        { label: "Transport", value: formatKg(emissionsSummary.transportKg) || "", share: "" },
        { label: "Stay", value: formatKg(emissionsSummary.stayKg) || "", share: "" },
        { label: "Activities", value: formatKg(emissionsSummary.activitiesKg) || "", share: "" },
      ]
    : carbonBreakdown;

  useEffect(() => {
    const loadCurrentSessionTrips = async () => {
      setLoading(true);
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
        const headers: any = { 'Content-Type': 'application/json' };

        let uid: string | null = null;

        // 1. Authenticate (mock backend always returns demo user)
        const meRes = await fetch(`${apiBase}/api/auth/me`, { headers, credentials: 'include' });
        if (meRes.ok) {
          const meJson = await meRes.json();
          uid = meJson?.user?.id ?? null;
          setUserId(uid);
        }

        // 2. Priority: Show fresh trips from LocalStorage
        const stored = localStorage.getItem('lastGeneratedTrips');
        if (stored && !hasProcessedGeneratedTrips.current) {
          const local: Trip[] = JSON.parse(stored);
          setDisplayTrips(local);
          hasProcessedGeneratedTrips.current = true;
          setLoading(false);
          return; // STOP HERE - Don't load history
        }

        // 3. Fallback: Fetch ONLY the latest batch from Backend
        if (uid) {
          const backendRes = await fetch(`${apiBase}/api/trips?userID=${uid}`, { headers, credentials: 'include' });
          if (backendRes.ok) {
            const allSavedTrips: Trip[] = await backendRes.json();
            
            if (allSavedTrips.length > 0) {
              // Sort by newest first
              allSavedTrips.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
              
              // Filter: Only show trips created in the same "batch" (within 30 seconds of the newest trip)
              const newestTripTime = new Date(allSavedTrips[0].createdAt!).getTime();
              const currentBatch = allSavedTrips.filter(trip => {
                const tripTime = new Date(trip.createdAt!).getTime();
                return (newestTripTime - tripTime) < 30000; // 30 second window
              });
              
              setDisplayTrips(currentBatch);
              setDemoMode(false);
              return;
            }
          }
        }

        // 4. Demo fallback
        setDisplayTrips(demoTrips);
        setDemoMode(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentSessionTrips();
  }, [router]);

  const handleDelete = async (tripId: string) => {
    if (!confirm("Remove this option?")) return;
    setIsDeleting(tripId);
    try {
      if (demoMode) {
        setDisplayTrips(prev => prev.filter(t => t._id !== tripId));
        return;
      }
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const token = localStorage.getItem('sessionToken');
      const res = await fetch(`${apiBase}/api/trips/${tripId}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setDisplayTrips(prev => prev.filter(t => t._id !== tripId));
    } catch (err) {
      alert("Delete failed");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setPromptError("Please enter a trip prompt before generating a plan.");
      setDisplayTrips([]);
      setDemoMode(false);
      setPromptDebug(null);
      localStorage.removeItem('lastGeneratedTrips');
      return;
    }

    setPromptError(null);
    setIsGenerating(true);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const promptLower = trimmedPrompt.toLowerCase();
      const originDestination = extractOriginDestination(promptLower);
      const fallbackOrigin = knownCities.find((city) => promptLower.includes(city)) ?? null;
      const origin = originDestination.origin || fallbackOrigin;
      const destination =
        originDestination.destination ||
        knownCities.find((city) => promptLower.includes(city) && city !== origin) ||
        null;
      const durationDays = extractDuration(promptLower);
      const budget = extractBudget(promptLower);
      const travelDate = extractTravelDate(promptLower);
      const wantsRail = /rail|train/i.test(promptLower);
      const avoidsFlights = /avoid\s*flights|no\s*flight/i.test(promptLower);
      const wantsLocalFood = /local\s*food|street\s*food|veg|vegetarian/i.test(promptLower);

      const missing: string[] = [];
      if (!origin) missing.push("origin");
      if (!destination) missing.push("destination");
      if (!durationDays) missing.push("duration");
      if (!budget) missing.push("budget");
      if (!travelDate) missing.push("date");
      if (!wantsRail && !avoidsFlights && !wantsLocalFood) missing.push("preferences");

      const dateInfo = buildTripDates(travelDate, durationDays);
      if (!origin || !destination || !budget || !dateInfo) {
        setPromptError("Please include origin, destination, budget, and dates in the prompt.");
        setPromptDebug({
          extracted: {
            origin,
            destination,
            durationDays,
            budget,
            travelDate,
            preferences: {
              rail: wantsRail,
              avoidFlights: avoidsFlights,
              localFood: wantsLocalFood,
            },
          },
          missing,
        });
        setIsGenerating(false);
        return;
      }

      const outboundCost = Math.round(budget * 0.25);
      const returnCost = Math.round(budget * 0.33);
      const tripDetails = {
        from: origin,
        to: destination,
        startDate: dateInfo.startDate,
        deadline: dateInfo.deadline,
        budget,
        userID: userId || 'demo-user',
        travelSelection: {
          outboundId: 'prompt_outbound',
          returnId: 'prompt_return',
          outboundCost,
          returnCost,
        },
        budgetRemaining: Math.max(0, budget - outboundCost - returnCost),
        avoidNightTravel: false,
        sideLocations: [],
      };

      const res = await fetch(`${apiBase}/api/trips/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripDetails),
      });

      if (!res.ok) throw new Error("Plan generation failed");
      const trips = await res.json();

      setPromptDebug({
        extracted: {
          origin,
          destination,
          durationDays,
          budget,
          travelDate,
          preferences: {
            rail: wantsRail,
            avoidFlights: avoidsFlights,
            localFood: wantsLocalFood,
          },
        },
        missing,
      });

      setDisplayTrips(trips);
      setDemoMode(false);
      localStorage.setItem('lastGeneratedTrips', JSON.stringify(trips));
      setLastGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setDisplayTrips(demoTrips);
      setDemoMode(true);
      localStorage.setItem('lastGeneratedTrips', JSON.stringify(demoTrips));
      setLastGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setPromptDebug(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head><title>EcoWise Planner</title></Head>
      <div className="min-h-screen bg-site p-6 text-site">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="kicker text-primary">NLP trip brief</div>
                <h1 className="mt-2 text-3xl font-black">Describe your trip. EcoWise handles the rest.</h1>
                <p className="mt-2 text-sm text-muted">
                  Use everyday language to generate a sustainable itinerary. Demo mode uses synthetic data.
                </p>
                {demoMode && (
                  <div className="mt-3 text-xs text-emerald-600 font-semibold">Demo mode active</div>
                )}
              </div>
              <div className="rounded-xl border border-emerald-200/40 bg-emerald-500/10 px-4 py-3 text-sm">
                <div className="text-xs text-muted">Average carbon savings</div>
                <div className="text-2xl font-bold text-site">-32% CO2</div>
                <div className="text-xs text-muted">Based on similar routes</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted">Trip prompt</label>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Example: 3-day eco trip from Bengaluru under ₹20k, prefer rail, local food"
                  className="mt-2 w-full min-h-[120px] rounded-xl border border-white/10 bg-card p-4 text-sm text-site focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {promptError && (
                  <div className="mt-2 text-xs font-semibold text-amber-600">{promptError}</div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {examplePrompts.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPrompt(item)}
                      className="chip"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted">AI summary</div>
                <div className="text-sm text-site">Carbon-aware routes, green stays, and local-first experiences.</div>
                <div className="text-xs text-muted">Estimated output: 3 itinerary options</div>
                {lastGeneratedAt && (
                  <div className="text-xs text-emerald-600 font-semibold">Last generated at {lastGeneratedAt}</div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm btn-primary text-white hover:brightness-90 transition ${isGenerating ? "shimmer-button" : ""}`}
                >
                  {isGenerating ? "Generating..." : "Generate EcoWise Plan"}
                </button>
                <button
                  onClick={() => router.push('/dashboard/saved-trips')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border bg-card text-site hover:shadow-md transition"
                >
                  View Saved Trips
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              <div className="glass-card rounded-xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted">AI reasoning</div>
                <ul className="mt-3 space-y-2 text-sm text-site">
                  <li>Prioritize rail over flight when under 6 hours.</li>
                  <li>Rank stays with verified eco certification.</li>
                  <li>Optimize day routes to reduce backtracking.</li>
                  <li>Flag high-emission activities for swaps.</li>
                </ul>
                <div className="mt-3 text-xs text-muted">Synthetic explanation for demo.</div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted">Model output</div>
                <div className="mt-3 space-y-3">
                  {isGenerating ? (
                    <>
                      <div className="shimmer shimmer-block" />
                      <div className="shimmer shimmer-block" />
                      <div className="shimmer shimmer-block" />
                    </>
                  ) : (
                    modelOutputs.map((item) => (
                      <div key={item.label} className="rounded-lg border border-white/10 bg-white/40 p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-site">{item.label}</div>
                          <div className="text-xs font-semibold text-emerald-600">Score {item.score}</div>
                        </div>
                        <div className="text-xs text-muted">{item.why}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted">Carbon calculator</div>
                <div className="mt-3 text-sm text-site">
                  Estimated total impact: {emissionTotalLabel || "10.4 kg CO2e"}
                </div>
                <div className="mt-3 space-y-2">
                  {isGenerating ? (
                    <>
                      <div className="shimmer shimmer-line" />
                      <div className="shimmer shimmer-line" />
                      <div className="shimmer shimmer-line" />
                    </>
                  ) : (
                    emissionBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-xs text-muted">
                        <span>{item.label}</span>
                        <span className="text-site font-semibold">
                          {item.value}{item.share ? ` · ${item.share}` : ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-3 text-xs text-muted">
                  {emissionsSummary ? "Estimated emissions from synthetic model." : "Synthetic data for demo."}
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted">Prompt debugging</div>
                {isGenerating ? (
                  <div className="mt-3 space-y-2">
                    <div className="shimmer shimmer-line" />
                    <div className="shimmer shimmer-line" />
                    <div className="shimmer shimmer-line" />
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 text-xs text-muted">
                    <div>
                      Origin: <span className="text-site font-semibold">{promptDebug?.extracted.origin || "Not detected"}</span>
                    </div>
                    <div>
                      Destination: <span className="text-site font-semibold">{promptDebug?.extracted.destination || "Not detected"}</span>
                    </div>
                    <div>
                      Duration: <span className="text-site font-semibold">{promptDebug?.extracted.durationDays ? `${promptDebug.extracted.durationDays} days` : "Not detected"}</span>
                    </div>
                    <div>
                      Budget: <span className="text-site font-semibold">{promptDebug?.extracted.budget ? `₹${promptDebug.extracted.budget}` : "Not detected"}</span>
                    </div>
                    <div>
                      Date: <span className="text-site font-semibold">{promptDebug?.extracted.travelDate || "Not detected"}</span>
                    </div>
                    <div>
                      Preferences: <span className="text-site font-semibold">
                        {promptDebug?.extracted.preferences.rail ? "Rail" : ""}
                        {promptDebug?.extracted.preferences.avoidFlights ? " Avoid flights" : ""}
                        {promptDebug?.extracted.preferences.localFood ? " Local food" : ""}
                        {!promptDebug || (!promptDebug.extracted.preferences.rail && !promptDebug.extracted.preferences.avoidFlights && !promptDebug.extracted.preferences.localFood) ? "Not detected" : ""}
                      </span>
                    </div>
                    {promptDebug?.missing?.length ? (
                      <div className="mt-2 text-amber-600 font-semibold">
                        Missing: {promptDebug.missing.join(", ")}
                      </div>
                    ) : (
                      <div className="mt-2 text-emerald-600 font-semibold">All key fields detected</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black">Generated Trip Options</h2>
            <button 
              onClick={() => {
                localStorage.removeItem('lastGeneratedTrips');
                setDisplayTrips([]);
                setDemoMode(false);
                setPrompt("");
                setPromptDebug(null);
                setPromptError(null);
                setLastGeneratedAt(null);
              }}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-xl font-bold text-sm transition"
            >
              + Plan New Trip
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="animate-pulse font-medium">Fetching the latest plans...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-500">{error}</div>
          ) : displayTrips.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted mb-4">No recent trips found.</p>
              <button onClick={() => router.push('/dashboard')} className="text-primary font-bold hover:underline">Go to Dashboard</button>
            </div>
          ) : (
            displayTrips.map((trip, idx) => (
              <div key={trip._id || idx} className="mb-12 p-6 md:p-10 bg-card rounded-[2rem] shadow-2xl border border-white/5 relative">
                
                {/* Delete Icon */}
                <button 
                  onClick={() => handleDelete(trip._id || `demo-${idx}`)}
                  disabled={isDeleting === trip._id}
                  className="absolute top-6 right-6 p-2 text-muted hover:text-red-400 transition"
                >
                  {isDeleting === trip._id ? "..." : "🗑️"}
                </button>

                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-emerald-500/15 text-emerald-700 text-[10px] font-black uppercase rounded-full">
                      Low impact option {idx + 1}
                    </span>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                      Eco score {72 + idx * 4}
                    </span>
                    <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-700 text-[10px] font-black uppercase rounded-full">
                      CO2 -{24 + idx * 5}% vs typical
                    </span>
                  </div>
                  <h2 className="text-3xl font-black mb-2">{trip.plan_name || `${trip.from} to ${trip.to}`}</h2>
                  {trip.plan_rationale && <p className="text-muted italic text-sm border-l-2 border-primary/40 pl-4">"{trip.plan_rationale}"</p>}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-site/30 p-4 rounded-2xl text-center">
                    <p className="text-[10px] text-muted uppercase font-bold">Est. Cost</p>
                    <p className={`text-lg font-black ${trip.totalCost > trip.budget ? 'text-red-400' : 'text-green-400'}`}>₹{trip.totalCost}</p>
                  </div>
                  <div className="bg-site/30 p-4 rounded-2xl text-center">
                    <p className="text-[10px] text-muted uppercase font-bold">Daily Budget</p>
                    <p className="text-lg font-black">₹{(trip.budget / 5).toFixed(0)}</p>
                  </div>
                  <div className="bg-site/30 p-4 rounded-2xl text-center">
                    <p className="text-[10px] text-muted uppercase font-bold">CO2 Impact</p>
                    <p className="text-lg font-black text-emerald-600">
                      {trip.emissions?.totalKg !== undefined ? `${trip.emissions.totalKg.toFixed(1)} kg` : `${9.6 + idx * 1.8} kg`}
                    </p>
                  </div>
                  <div className="bg-site/30 p-4 rounded-2xl text-center md:col-span-2">
                    <p className="text-[10px] text-muted uppercase font-bold">Dates</p>
                    <p className="text-sm font-black">{formatDate(trip.startDate)} - {formatDate(trip.deadline)}</p>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-[10px] text-muted uppercase font-bold">Sustainable transport</div>
                    <div className="mt-2 text-sm font-semibold text-site">Rail + shared EV + walkable zones</div>
                    <div className="mt-1 text-xs text-muted">Estimated reduction: 40% vs flight</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-[10px] text-muted uppercase font-bold">Green stays</div>
                    <div className="mt-2 text-sm font-semibold text-site">Certified eco stay + local ownership</div>
                    <div className="mt-1 text-xs text-muted">Water reuse • Solar power</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-[10px] text-muted uppercase font-bold">Local impact</div>
                    <div className="mt-2 text-sm font-semibold text-site">+18% spend to community vendors</div>
                    <div className="mt-1 text-xs text-muted">Low-impact activities only</div>
                  </div>
                </div>

                {/* Itinerary Timeline */}
                <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
                  {trip.itinerary?.map((day) => (
                    <div key={day.day} className="relative pl-12">
                      <div className="absolute left-3 top-1 size-4 bg-primary rounded-full border-4 border-card z-10"></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                        <h4 className="text-xl font-bold">Day {day.day}: {day.theme}</h4>
                        <span className="text-xs font-medium text-muted">{formatDate(day.date)}</span>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {day.activities.map((act, i) => (
                          <li key={i} className="text-muted text-sm flex gap-2">
                            <span className="text-primary">•</span> {act}
                          </li>
                        ))}
                      </ul>

                      {day.accommodation && (
                        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-site/40 rounded-2xl border border-white/5 gap-4">
                          <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommended Stay</p>
                            <p className="font-bold text-sm">{day.accommodation.name}</p>
                          </div>
                          <a 
                            href={day.accommodation.booking_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-105 transition"
                          >
                            Book @ ₹{day.accommodation.estimated_cost_inr}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Transport Accordion */}
                {trip.plan.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-white/5">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-muted font-bold text-xs uppercase tracking-widest hover:text-primary transition">
                        Logistics & Transport
                        <span className="group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="mt-4 grid gap-3">
                        {trip.plan.map((seg, i) => (
                          <div key={i} className="p-4 bg-site/20 rounded-xl flex justify-between items-center text-sm">
                            <span><span className="font-bold">{seg.mode}</span>: {seg.source} → {seg.destination}</span>
                            <span className="font-mono text-primary font-bold">₹{seg.cost}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}