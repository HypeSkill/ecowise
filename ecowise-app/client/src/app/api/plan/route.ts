import { NextResponse } from "next/server";
import { generateTripsForPrompt } from "../trips/data";

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

const extractCity = (prompt: string) => {
  return knownCities.find((city) => prompt.includes(city)) ?? null;
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

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt : "";
  const promptLower = prompt.toLowerCase();

  if (!prompt.trim()) {
    return NextResponse.json(
      { error: "Prompt is required." },
      { status: 400 }
    );
  }

  const originDestination = extractOriginDestination(promptLower);
  const fallbackOrigin = extractCity(promptLower);
  const origin = originDestination.origin || fallbackOrigin;
  const destination = originDestination.destination || knownCities.find((city) => promptLower.includes(city) && city !== origin) || null;
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

  const trips = generateTripsForPrompt(prompt);
  return NextResponse.json({
    prompt,
    generatedAt: new Date().toISOString(),
    trips,
    debug: {
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
    },
  });
}
