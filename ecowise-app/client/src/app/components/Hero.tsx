'use client';

import { useRouter } from 'next/navigation';

const highlights = [
  {
    title: 'NLP trip brief',
    description: 'Describe your trip in everyday language. EcoWise turns it into a smart plan.',
    tag: 'Gemini-ready',
  },
  {
    title: 'Eco routing',
    description: 'Compare rail, flight, and EV options with real carbon impact.',
    tag: 'CO2 aware',
  },
  {
    title: 'Green stays',
    description: 'Surface certified hotels, hostels, and low-energy stays first.',
    tag: 'Verified',
  },
];

const impactStats = [
  { label: 'Avg CO2 reduction', value: '-32%', detail: 'vs typical plan' },
  { label: 'Local spend boost', value: '+18%', detail: 'small businesses' },
  { label: 'Time saved', value: '4.5 hrs', detail: 'auto-optimized' },
];

const itinerary = [
  {
    day: 'Day 1',
    title: 'Old Town + e-bike loop',
    mode: 'E-bike + walk',
    carbon: '3.2 kg CO2e',
  },
  {
    day: 'Day 2',
    title: 'Coastal rail + seafood market',
    mode: 'Regional rail',
    carbon: '6.4 kg CO2e',
  },
  {
    day: 'Day 3',
    title: 'Marine reserve kayak tour',
    mode: 'Non-motorized',
    carbon: '0.8 kg CO2e',
  },
];

const techStack = ['React', 'Next.js', 'Node/Express', 'MongoDB', 'NLP', 'Carbon APIs', 'Maps API'];

const modelCard = [
  { label: 'Input', value: 'Natural language trip brief + constraints' },
  { label: 'Models', value: 'Recommendation ranking + carbon prediction' },
  { label: 'Signals', value: 'Distance, mode, stay certification, budget' },
  { label: 'Output', value: 'Ranked itineraries with impact insights' },
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className="page-shell px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="kicker text-primary animate-fade-up">Eco-smart travel planning</div>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-site animate-fade-up">
              EcoWise turns travel ideas into low-carbon itineraries you can trust.
            </h1>
            <p className="mt-4 text-base text-muted max-w-xl animate-fade-up animate-delay-150">
              Tell EcoWise your budget, timeline, and vibe. Get AI-ranked destinations, greener transport options,
              and a day-by-day plan with clear carbon impact insights.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up animate-delay-250">
              <button
                onClick={() => router.push('/signup')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold shadow-sm btn-primary text-white hover:brightness-90 transition"
              >
                Start Planning
              </button>

              <button
                onClick={() => router.push('/trips')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border bg-card text-site hover:shadow-md transition"
              >
                View Demo Trips
              </button>
            </div>

            <div className="mt-6 text-sm text-muted">
              Demo data included. No account needed to explore. Save itineraries with a free account.
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="glass-card rounded-2xl overflow-hidden shadow-lg animate-fade-in animate-delay-250">
              <div className="grid-dots p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted">Eco score</div>
                    <div className="text-3xl font-bold text-site">82 / 100</div>
                  </div>
                  <div className="eco-badge">Low impact</div>
                </div>
                <div className="mt-5">
                  <div className="text-xs text-muted">CO2e per traveler</div>
                  <div className="mt-2 h-2 rounded-full bg-white/40">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Transport</span>
                    <span className="text-site font-medium">Rail + EV shuttle</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Stay</span>
                    <span className="text-site font-medium">Green key certified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Activities</span>
                    <span className="text-site font-medium">Low-impact tours</span>
                  </div>
                </div>
                <div className="mt-6 text-xs text-muted">Synthetic demo metrics for showcase.</div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1400&auto=format&fit=crop"
                alt="Eco destination preview"
                className="w-full h-44 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {impactStats.map((stat) => (
            <div key={stat.label} className="stat-card rounded-xl p-5 shadow-sm">
              <div className="text-2xl font-semibold text-site">{stat.value}</div>
              <div className="mt-2 text-sm text-muted">{stat.label}</div>
              <div className="text-xs text-muted">{stat.detail}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="kicker text-primary">How it works</div>
              <h2 className="mt-2 text-2xl font-bold text-site">Built for sustainable, human-first travel</h2>
              <p className="mt-3 text-sm text-muted">
                EcoWise blends recommendation models, carbon predictions, and route optimization to surface greener
                options without sacrificing comfort or affordability.
              </p>
            </div>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-site">{item.title}</h3>
                    <span className="eco-badge">{item.tag}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-site">3-day demo itinerary</h3>
              <span className="eco-badge">Carbon-aware</span>
            </div>
            <div className="mt-4 space-y-4">
              {itinerary.map((item) => (
                <div key={item.day} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted">{item.day}</div>
                    <div className="text-base font-semibold text-site">{item.title}</div>
                    <div className="text-xs text-muted">{item.mode}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">{item.carbon}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-white/60 p-4">
              <div className="text-xs text-muted">Projected total impact</div>
              <div className="mt-1 text-xl font-bold text-site">10.4 kg CO2e</div>
              <div className="text-xs text-muted">42% lower than similar itineraries</div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="kicker text-primary">Tech stack</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="kicker text-primary">Model card</div>
            <h3 className="mt-2 text-xl font-semibold text-site">How EcoWise AI works</h3>
            <p className="mt-2 text-sm text-muted">
              Transparent, explainable decision-making for sustainable travel choices.
            </p>
            <div className="mt-4 space-y-3">
              {modelCard.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted">{item.label}</span>
                  <span className="text-site font-semibold text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="kicker text-primary">Demo note</div>
            <h3 className="mt-2 text-xl font-semibold text-site">Synthetic data for showcase</h3>
            <p className="mt-2 text-sm text-muted">
              This demo uses synthetic itineraries and carbon estimates to illustrate the full AI flow end-to-end.
            </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm grid-dots p-4 rounded-xl bg-card">
  <div className="
    rounded-xl p-4 bg-card shadow-sm
    transition-all duration-200
    hover:-translate-y-1 hover:shadow-lg
  ">
    <div className="text-xs uppercase tracking-widest text-muted mb-1">
      Routes
    </div>
    <div className="font-semibold text-site">
      Map-ready
    </div>
  </div>

  <div className="
    rounded-xl p-4 bg-card shadow-sm
    transition-all duration-200
    hover:-translate-y-1 hover:shadow-lg
  ">
    <div className="text-xs uppercase tracking-widest text-muted mb-1">
      CO2
    </div>
    <div className="font-semibold text-site">
      API stubs
    </div>
  </div>

  <div className="
    rounded-xl p-4 bg-card shadow-sm
    transition-all duration-200
    hover:-translate-y-1 hover:shadow-lg
  ">
    <div className="text-xs uppercase tracking-widest text-muted mb-1">
      NLP
    </div>
    <div className="font-semibold text-site">
      Gemini-ready
    </div>
  </div>

  <div className="
    rounded-xl p-4 bg-card shadow-sm
    transition-all duration-200
    hover:-translate-y-1 hover:shadow-lg
  ">
    <div className="text-xs uppercase tracking-widest text-muted mb-1">
      Ranking
    </div>
    <div className="font-semibold text-site">
      ML scoring
    </div>
  </div>
</div>

          </div>
        </div>

        <div className="mt-14 glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-site">Ready to build a greener trip?</h3>
            <p className="mt-2 text-sm text-muted">
              Launch the planner or explore curated demos to show judges the full AI flow.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/dashboard/trips')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold shadow-sm btn-primary text-white hover:brightness-90 transition"
            >
              Open Planner
            </button>
            <button
              onClick={() => router.push('/dashboard/saved-trips')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border bg-card text-site hover:shadow-md transition"
            >
              Show Saved Trips
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}