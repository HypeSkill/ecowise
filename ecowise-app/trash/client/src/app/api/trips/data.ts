export interface TripSegment {
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

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  activities: string[];
  accommodation?: {
    name: string;
    location?: string;
    estimated_cost_inr: number;
    booking_link: string;
  } | null;
}

export interface Trip {
  _id: string;
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
  warnings: string[];
  userID: string;
  createdAt?: string;
  travelSelection?: {
    outboundId?: string;
    returnId?: string;
    outboundCost?: number;
    returnCost?: number;
  };
  sideLocations?: Array<{
    name: string;
    days: number;
    budget?: number;
  }>;
}

const now = new Date().toISOString();

const baseTrips: Trip[] = [
  {
    _id: "mock-1",
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
        source: "City loop",
        destination: "City loop",
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
      {
        mode: "Rail",
        source: "Mysuru",
        destination: "Bengaluru",
        serviceNumber: "R13",
        departureTime: "2026-02-16T17:30:00",
        arrivalTime: "2026-02-16T19:40:00",
        cost: 320,
        durationHrs: 2.2,
        layover: null,
        bufferMins: 15,
        bufferNote: "Station buffer",
        availability: "Good",
        warnings: null,
        distanceKm: 140,
      },
    ],
    total_cost_accommodation_activities: 5400,
    totalCost: 8120,
    budgetRemaining: 7880,
    warnings: ["Low evening transit frequency after 9 PM."],
    userID: "demo-user",
    createdAt: now,
    travelSelection: { outboundId: "R12", returnId: "R13", outboundCost: 320, returnCost: 320 },
    sideLocations: [{ name: "Srirangapatna", days: 1, budget: 2500 }],
  },
  {
    _id: "mock-2",
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
      {
        mode: "Shared EV",
        source: "Jaipur",
        destination: "Amber Fort",
        serviceNumber: null,
        departureTime: "2026-03-03T08:40:00",
        arrivalTime: "2026-03-03T09:20:00",
        cost: 520,
        durationHrs: 0.7,
        layover: null,
        bufferMins: 15,
        bufferNote: "Pickup buffer",
        availability: "Moderate",
        warnings: null,
        distanceKm: 19,
      },
      {
        mode: "Rail",
        source: "Jaipur",
        destination: "Delhi",
        serviceNumber: "JP Express",
        departureTime: "2026-03-05T16:10:00",
        arrivalTime: "2026-03-05T20:40:00",
        cost: 850,
        durationHrs: 4.6,
        layover: null,
        bufferMins: 25,
        bufferNote: "Station buffer",
        availability: "Limited",
        warnings: null,
        distanceKm: 280,
      },
    ],
    total_cost_accommodation_activities: 11600,
    totalCost: 17820,
    budgetRemaining: 6180,
    warnings: ["Book Fort shuttle in advance on weekends."],
    userID: "demo-user",
    createdAt: now,
    travelSelection: { outboundId: "JP Express", returnId: "JP Express", outboundCost: 850, returnCost: 850 },
    sideLocations: [{ name: "Amber Fort", days: 1, budget: 3000 }],
  },
  {
    _id: "mock-3",
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
      {
        mode: "Rail",
        source: "Mumbai",
        destination: "Goa",
        serviceNumber: null,
        departureTime: "2026-04-10T21:15:00",
        arrivalTime: "2026-04-11T08:20:00",
        cost: 1400,
        durationHrs: 11.5,
        layover: null,
        bufferMins: null,
        bufferNote: null,
        availability: "Limited",
        warnings: null,
        distanceKm: 590,
      },
      {
        mode: "Cycle",
        source: "Local trails",
        destination: "Local trails",
        serviceNumber: null,
        departureTime: "2026-04-11T09:00:00",
        arrivalTime: "2026-04-11T12:30:00",
        cost: 400,
        durationHrs: 3.5,
        layover: null,
        bufferMins: null,
        bufferNote: null,
        availability: "Reserved",
        warnings: null,
        distanceKm: 22,
      },
      {
        mode: "Rail",
        source: "Goa",
        destination: "Mumbai",
        serviceNumber: null,
        departureTime: "2026-04-14T18:10:00",
        arrivalTime: "2026-04-15T06:00:00",
        cost: 1400,
        durationHrs: 11.8,
        layover: null,
        bufferMins: 15,
        bufferNote: "Station buffer",
        availability: "Limited",
        warnings: null,
        distanceKm: 590,
      },
    ],
    total_cost_accommodation_activities: 16200,
    totalCost: 24200,
    budgetRemaining: 7800,
    warnings: ["Overnight rail has limited berths. Reserve early."],
    userID: "demo-user",
    createdAt: now,
    travelSelection: { outboundId: "R12", returnId: "R13", outboundCost: 320, returnCost: 320 },
    sideLocations: [{ name: "Srirangapatna", days: 1, budget: 2500 }],
  },
];

export const getTrips = () => baseTrips;

export const generateTripsForPrompt = (prompt: string) => {
  if (/jaipur/i.test(prompt)) {
    return baseTrips.slice(1, 2);
  }
  if (/mumbai|goa/i.test(prompt)) {
    return baseTrips.slice(2, 3);
  }
  return baseTrips.slice(0, 2);
};
