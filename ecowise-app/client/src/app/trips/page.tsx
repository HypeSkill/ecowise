"use client";

import React from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

interface TripPreview {
  id: string;
  title: string;
  region: string;
  duration: string;
  budget: string;
  ecoScore: number;
  carbon: string;
  transport: string;
  highlights: string[];
  image: string;
}

const demoTrips: TripPreview[] = [
  {
    id: "eco-1",
    title: "Heritage Rail Escape",
    region: "Bengaluru → Mysuru",
    duration: "3 days",
    budget: "₹8.1k",
    ecoScore: 82,
    carbon: "10.4 kg CO2e",
    transport: "Regional rail + e-bike",
    highlights: ["Palace district walk", "E-bike lake loop", "Zero-waste cafe"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "eco-2",
    title: "Pink City Slow Travel",
    region: "Delhi → Jaipur",
    duration: "4 days",
    budget: "₹17.8k",
    ecoScore: 76,
    carbon: "19.2 kg CO2e",
    transport: "Express rail + shared EV",
    highlights: ["Fort shuttle", "Artisan studio", "Local market"],
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "eco-3",
    title: "Coastal Rail + Community Stays",
    region: "Mumbai → Goa",
    duration: "5 days",
    budget: "₹24.2k",
    ecoScore: 71,
    carbon: "28.6 kg CO2e",
    transport: "Overnight rail + cycle",
    highlights: ["Mangrove kayak", "Community kitchen", "Beach cleanup"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "eco-4",
    title: "Hill Town Carbon Reset",
    region: "Chennai → Ooty",
    duration: "4 days",
    budget: "₹19.4k",
    ecoScore: 79,
    carbon: "16.8 kg CO2e",
    transport: "Rail + electric shuttle",
    highlights: ["Tea estate walk", "Forest trail", "Local homestay"],
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function TripsPage() {
  const router = useRouter();

  return (
    <>
      <Head><title>EcoWise Demo Trips</title></Head>
      <main className="min-h-screen bg-site text-site px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="kicker text-primary">Demo library</div>
              <h1 className="mt-3 text-3xl md:text-4xl font-black">Eco-smart trips curated by EcoWise</h1>
              <p className="mt-2 text-sm text-muted">
                Synthetic demo itineraries with carbon estimates and sustainable transport mixes.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/trips")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold shadow-sm btn-primary text-white hover:brightness-90 transition"
            >
              Open AI Planner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoTrips.map((trip) => (
              <div key={trip.id} className="glass-card rounded-2xl overflow-hidden shadow-lg">
                <img src={trip.image} alt={trip.title} className="w-full h-48 object-cover" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-site">{trip.title}</h2>
                      <div className="text-sm text-muted">{trip.region} • {trip.duration}</div>
                    </div>
                    <div className="eco-badge">Eco {trip.ecoScore}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white/60 p-3">
                      <div className="text-xs text-muted">Budget</div>
                      <div className="font-semibold text-site">{trip.budget}</div>
                    </div>
                    <div className="rounded-xl bg-white/60 p-3">
                      <div className="text-xs text-muted">CO2 impact</div>
                      <div className="font-semibold text-site">{trip.carbon}</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted">Transport: {trip.transport}</div>

                  <div className="flex flex-wrap gap-2">
                    {trip.highlights.map((item) => (
                      <span key={item} className="chip">{item}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push("/dashboard/trips")}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm btn-primary text-white hover:brightness-90 transition"
                    >
                      Build Similar Plan
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/saved-trips")}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border bg-card text-site hover:shadow-md transition"
                    >
                      Save Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
