// src/app/dashboard/saved-trips/page.tsx
"use client";

import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Re-use interfaces for type safety
interface TripSegment {
  mode: string;
  source: string;
  destination: string;
  serviceNumber: string | null;
  departureTime: string;
  arrivalTime: string;
  cost: number;
  durationHrs: number;
  layover: string | null;
  bufferMins: number | null;
  bufferNote: string | null;
  availability: string;
  warnings: string[] | null;
  distanceKm?: number;
}

interface Trip {
  _id?: string;
  from: string;
  to: string;
  startDate: string;
  deadline: string;
  budget: number;
  plan: TripSegment[];
  warnings: string[];
  userID: string;
  totalCost: number;
  createdAt?: string;
  updatedAt?: string;
  travelSelection?: {
    outboundId?: string;
    returnId?: string;
    outboundCost?: number;
    returnCost?: number;
  };
  budgetRemaining?: number;
  sideLocations?: Array<{
    name: string;
    days: number;
    budget?: number;
  }>;
}

const demoSavedTrips: Trip[] = [
  {
    _id: "saved-demo-1",
    from: "Bengaluru",
    to: "Mysuru",
    startDate: "2026-02-14",
    deadline: "2026-02-16",
    budget: 16000,
    plan: [
      {
        mode: "Rail",
        source: "Bengaluru",
        destination: "Mysuru",
        serviceNumber: "R12",
        departureTime: "2026-02-14T06:10:00",
        arrivalTime: "2026-02-14T08:15:00",
        cost: 320,
        durationHrs: 2.1,
        layover: null,
        bufferMins: 20,
        bufferNote: "Early arrival recommended",
        availability: "Good",
        warnings: null,
        distanceKm: 140,
      },
      {
        mode: "E-bike",
        source: "Palace district",
        destination: "Lake loop",
        serviceNumber: null,
        departureTime: "2026-02-15T09:00:00",
        arrivalTime: "2026-02-15T12:00:00",
        cost: 500,
        durationHrs: 3,
        layover: null,
        bufferMins: null,
        bufferNote: null,
        availability: "Reserved",
        warnings: ["Carry refillable water."],
        distanceKm: 18,
      },
    ],
    warnings: ["Low evening transit frequency after 9 PM."],
    userID: "demo",
    totalCost: 8120,
    createdAt: "2026-02-10",
    budgetRemaining: 7880,
    sideLocations: [{ name: "Srirangapatna", days: 1, budget: 2500 }],
  },
  {
    _id: "saved-demo-2",
    from: "Delhi",
    to: "Jaipur",
    startDate: "2026-03-02",
    deadline: "2026-03-05",
    budget: 24000,
    plan: [
      {
        mode: "Rail",
        source: "Delhi",
        destination: "Jaipur",
        serviceNumber: "JP Express",
        departureTime: "2026-03-02T07:20:00",
        arrivalTime: "2026-03-02T11:50:00",
        cost: 850,
        durationHrs: 4.5,
        layover: null,
        bufferMins: 25,
        bufferNote: "Station buffer",
        availability: "Limited",
        warnings: null,
        distanceKm: 280,
      },
    ],
    warnings: ["Book Fort shuttle in advance on weekends."],
    userID: "demo",
    totalCost: 17820,
    createdAt: "2026-02-10",
    budgetRemaining: 6180,
    sideLocations: [{ name: "Amber Fort", days: 1, budget: 3000 }],
  },
];

export default function SavedTripsPage() {
  const router = useRouter();
  const [userID, setUserID] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const fetchSavedTrips = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("sessionToken")
            : null;
        const headers: any = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const meRes = await fetch(`${apiBase}/api/auth/me`, {
          headers,
          credentials: "include",
        });

        if (!meRes.ok) {
          setSavedTrips(demoSavedTrips);
          setDemoMode(true);
          setLoading(false);
          return;
        }

        const meJson = await meRes.json();
        const uid = meJson?.user?.id ?? null;
        setUserID(uid);

        if (!uid) {
          setSavedTrips(demoSavedTrips);
          setDemoMode(true);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${apiBase}/api/trips?userID=${uid}`,
          { headers, credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data: Trip[] = await res.json();

        data.sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() -
            new Date(a.createdAt!).getTime()
        );

        setSavedTrips(data.length ? data : demoSavedTrips);
        setDemoMode(data.length === 0);
      } catch (err: any) {
        setError(err.message);
        setSavedTrips(demoSavedTrips);
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTrips();
  }, [router]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeString: string) =>
    new Date(timeString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const getPlanKey = (trip: Trip, idx: number) =>
    trip._id || `${trip.from}-${trip.to}-${trip.startDate}-${idx}`;

  return (
    <>
      <Head>
        <title>EcoWise Saved Trips</title>
      </Head>

      <div className="relative flex min-h-screen flex-col bg-site overflow-x-hidden">
        <div className="px-6 md:px-40 flex flex-1 justify-center py-8">
          <div className="flex flex-col max-w-[960px] flex-1">
            {loading ? (
              <p className="text-site text-lg">Loading saved trips...</p>
            ) : error ? (
              <p className="text-red-400 text-lg">Error: {error}</p>
            ) : (
              savedTrips.map((trip, idx) => (
                <div
                  key={getPlanKey(trip, idx)}
                  className="mb-8 p-6 rounded-lg bg-card shadow-lg animate-fade-up"
                >
                  <h2 className="text-site text-2xl font-bold mb-4">
                    Trip {idx + 1}: {trip.from} to {trip.to}
                  </h2>

                  {/* SUMMARY */}
                  <div className="flex flex-col gap-2 pb-4 border-b mb-4 border-primary/20">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Planned from{" "}
                      <span className="font-semibold text-site">
                        {formatDate(trip.startDate)}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-site">
                        {formatDate(trip.deadline)}
                      </span>
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Original Budget: ₹{trip.budget} | Estimated Cost: ₹
                      {trip.totalCost}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Remaining Budget: ₹{trip.budgetRemaining}
                    </p>
                  </div>

                  {/* SIDE LOCATIONS */}
                  {trip.sideLocations && (
                    <div className="rounded-lg p-3 mb-4
                bg-blue-100 text-blue-900
                dark:bg-blue-800 dark:bg-opacity-30 dark:text-blue-200">
  <p className="text-sm font-semibold mb-2">
    Side Locations / Multi-stop Destinations:
  </p>
  <ul className="list-disc list-inside text-sm space-y-1">

                        {trip.sideLocations.map((loc, i) => (
                          <li key={i}>
                            {loc.name} — {loc.days} day(s) (₹{loc.budget})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* WARNINGS */}
                  {trip.warnings.length > 0 && (
                    <div className="bg-yellow-800 bg-opacity-30 rounded-lg p-3 mb-4">
                      <p className="text-yellow-300 text-sm font-semibold mb-1">
                        Warnings for this Plan:
                      </p>
                      <ul className="list-disc list-inside text-yellow-200 text-sm">
                        {trip.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ITINERARY */}
                  <h3 className="text-site text-xl font-semibold mb-4 border-b pb-2 border-primary/20">
                    Itinerary Details:
                  </h3>

                  <div className="relative pl-6 border-l-2 border-dashed border-primary">
                    {trip.plan.map((segment, i) => (
                      <div key={i} className="mb-6 relative">
                        <div className="absolute -left-3 top-0 size-5 rounded-full bg-primary border-2 border-bg" />
                        <div className="bg-card rounded-lg p-4 shadow-md">
                          <p className="text-site font-semibold">
                            {segment.mode}: {segment.source} →{" "}
                            {segment.destination}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Departure: {formatDate(segment.departureTime)}{" "}
                            {formatTime(segment.departureTime)}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Arrival: {formatDate(segment.arrivalTime)}{" "}
                            {formatTime(segment.arrivalTime)}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Duration: {segment.durationHrs} hrs | Cost: ₹
                            {segment.cost}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex px-4 py-3 justify-between mt-4">
                    <button className="rounded-xl h-10 px-4 bg-card text-site text-sm font-bold shadow-sm">
                      Edit Trip
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/trips")}
                      className="rounded-xl h-10 px-4 btn-primary text-white text-sm font-bold shadow-md"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
