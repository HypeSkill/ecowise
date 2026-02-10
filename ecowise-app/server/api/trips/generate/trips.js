const axios = require('axios');
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Trip = require('../../../models/Trip');
require('dotenv').config();

// Validation helper
function isValidISODateString(str) {
  const d = new Date(str);
  return !isNaN(d.getTime());
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeMode(mode) {
  return String(mode || '').trim().toLowerCase();
}

function estimateSegmentDistanceKm(segment) {
  if (isFiniteNumber(segment?.distanceKm)) {
    return Number(segment.distanceKm);
  }
  if (isFiniteNumber(segment?.durationHrs)) {
    return Math.max(5, Number(segment.durationHrs) * 60);
  }
  return 120;
}

function emissionFactorKgPerKm(mode) {
  const key = normalizeMode(mode);
  if (key.includes('rail') || key.includes('train')) return 0.04;
  if (key.includes('bus')) return 0.08;
  if (key.includes('ev') || key.includes('electric')) return 0.05;
  if (key.includes('metro') || key.includes('subway')) return 0.06;
  if (key.includes('car') || key.includes('taxi')) return 0.18;
  if (key.includes('flight') || key.includes('air')) return 0.25;
  if (key.includes('walk') || key.includes('cycle') || key.includes('bike')) return 0.0;
  return 0.12;
}

function computeEmissions(planSegments, itineraryDays) {
  const transportKg = (planSegments || []).reduce((sum, segment) => {
    const distance = estimateSegmentDistanceKm(segment);
    return sum + distance * emissionFactorKgPerKm(segment.mode);
  }, 0);

  const days = Array.isArray(itineraryDays) ? itineraryDays.length : 0;
  const stayKg = Math.max(0, days - 1) * 1.2;
  const activitiesKg = days * 0.4;
  const totalKg = transportKg + stayKg + activitiesKg;

  return {
    transportKg: Number(transportKg.toFixed(2)),
    stayKg: Number(stayKg.toFixed(2)),
    activitiesKg: Number(activitiesKg.toFixed(2)),
    totalKg: Number(totalKg.toFixed(2))
  };
}

function buildFallbackPlan({
  from,
  to,
  startDate,
  deadline,
  budget,
  outboundCost,
  returnCost,
  safeSideLocations,
  avoidNightTravel
}) {
  const day1 = new Date(startDate);
  const dayLast = new Date(deadline);
  const accommodationCost = Math.max(0, Math.round((Number(budget) - outboundCost - returnCost) * 0.6));

  return {
    plan_name: 'Eco smart fallback plan',
    plan_rationale: 'Fallback plan generated to keep the demo running. Focuses on walkability, local food, and low-impact activities.',
    itinerary: [
      {
        day: 1,
        date: day1.toISOString(),
        theme: 'Arrival + local low-impact loop',
        activities: [
          'Use public transport or walkable routes',
          'Local vegetarian or seasonal meal',
          'Community market visit'
        ],
        accommodation: {
          name: 'Eco stay (demo)',
          estimated_cost_inr: Math.max(0, Math.round(accommodationCost * 0.5))
        }
      },
      {
        day: 2,
        date: dayLast.toISOString(),
        theme: 'Nature + return',
        activities: [
          'Low-emission activity (walk, cycle, or park)',
          'Return using selected transport'
        ],
        accommodation: {
          name: 'Eco stay (demo)',
          estimated_cost_inr: Math.max(0, Math.round(accommodationCost * 0.5))
        }
      }
    ],
    plan: [
      {
        mode: 'Outbound',
        source: from,
        destination: to,
        cost: outboundCost,
        departureTime: new Date(`${startDate}T09:00:00`).toISOString(),
        arrivalTime: new Date(`${startDate}T11:00:00`).toISOString()
      },
      {
        mode: 'Return',
        source: to,
        destination: from,
        cost: returnCost,
        departureTime: new Date(`${deadline}T17:00:00`).toISOString(),
        arrivalTime: new Date(`${deadline}T19:00:00`).toISOString()
      }
    ],
    total_cost_accommodation_activities: accommodationCost,
    warnings: avoidNightTravel ? ['Fallback plan uses daytime travel only.'] : [],
    sideLocations: safeSideLocations
  };
}


const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again shortly.' }
});

router.use(aiLimiter);

router.post('/', async (req, res) => {
  const {
    from,
    to,
    startDate,
    deadline,
    budget,
    userID,
    travelSelection,
    budgetRemaining,
    sideLocations,
    avoidNightTravel
  } = req.body;

  // ---------- 1. VALIDATION ----------
  if (!from || !to || !startDate || !deadline || !budget || !userID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidISODateString(startDate) || !isValidISODateString(deadline)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  if (!isFiniteNumber(Number(budget)) || Number(budget) <= 0) {
    return res.status(400).json({ error: 'Invalid budget value' });
  }

  const safeSideLocations = Array.isArray(sideLocations) ? sideLocations : [];
  const safeTravelSelection = travelSelection && typeof travelSelection === 'object'
    ? travelSelection
    : {};

  if (!safeTravelSelection.outboundId || !safeTravelSelection.returnId) {
    return res.status(400).json({ error: 'Missing travelSelection details' });
  }

  const outboundCost = Number(safeTravelSelection.outboundCost || 0);
  const returnCost = Number(safeTravelSelection.returnCost || 0);
  if (!isFiniteNumber(outboundCost) || !isFiniteNumber(returnCost)) {
    return res.status(400).json({ error: 'Invalid travelSelection costs' });
  }

  // ---------- 2. GEMINI PROMPT ----------
  const today = new Date().toISOString().split('T')[0];

  const geminiPrompt = `
Current Date for context: ${today}
Target Trip: ${from} to ${to}
Dates: From ${startDate} to ${deadline}
Total Budget: ₹${budget}
Calculated Remaining Budget for Stay/Food: ₹${budgetRemaining}

USER PREFERENCES:
- Side Locations to include: ${JSON.stringify(safeSideLocations)}
- Avoid Night Travel: ${Boolean(avoidNightTravel)}
- Outbound Transport: ${safeTravelSelection.outboundId} (Cost: ₹${outboundCost})
- Return Transport: ${safeTravelSelection.returnId} (Cost: ₹${returnCost})

STRICT INSTRUCTIONS:
1. Itinerary must include the requested Side Locations (${safeSideLocations.map(l => l.name).join(', ')}) for the specified number of days.
2. The "plan" array MUST use the exact transport costs and modes provided in the preferences above.
3. Return ONLY valid JSON as an ARRAY of one plan.
4. Use ISO-8601 strings for all date fields.
5. Optimize for eco-friendly travel: prefer low-emission activities, local food, walkability, public transport, and minimal waste.
6. If the provided transport modes are high-emission, mention mitigation tips in plan_rationale (e.g., carbon offsets, longer stays, or local conservation support).

Schema:
[{
  "plan_name": string,
  "plan_rationale": string,
  "itinerary": [
    { "day": number, "date": string, "theme": string, "activities": string[], "accommodation": { "name": string, "estimated_cost_inr": number } }
  ],
  "plan": [
    { "mode": string, "source": string, "destination": string, "cost": number, "departureTime": string, "arrivalTime": string }
  ],
  "total_cost_accommodation_activities": number
}]
`;

  try {
    // ---------- 3. API CALL ----------
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 45000,
        maxContentLength: 1000000
      }
    );

    // ---------- 4. PARSING & CLEANING ----------
    let raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return res.status(502).json({ error: 'AI response was empty' });
    }
    
    // Safety check: Remove markdown code blocks if Gemini ignores the system instruction
    const cleanJson = raw.replace(/```json|```/g, "").trim();
    let parsedPlans;
    try {
      parsedPlans = JSON.parse(cleanJson);
    } catch (parseErr) {
      return res.status(502).json({
        error: 'AI returned invalid JSON',
        message: parseErr.message
      });
    }

    const finalDocs = [];

    // Ensure we handle both single object or array responses
    const plansArray = Array.isArray(parsedPlans) ? parsedPlans : [parsedPlans];

    for (const plan of plansArray) {
      // Normalize itinerary
      const normalizedItinerary = (plan.itinerary || []).map(d => ({
        ...d,
        date: new Date(d.date).toISOString(),
        activities: Array.isArray(d.activities) ? d.activities : []
      }));
      let overnight = false;
      let transportCost = outboundCost + returnCost;
      const transportSegments = plan.plan || [];
      for (const seg of transportSegments) {
        transportCost += Number(seg.cost || 0);
        const dep = new Date(seg.departureTime);
        const arr = new Date(seg.arrivalTime);
        if (dep.toDateString() !== arr.toDateString()) {
          overnight = true;
        }
      }
// Calculate true remaining based on what the AI spent on hotels/food
      const accommodationCost = Number(plan.total_cost_accommodation_activities || 0);
      const remaining =
        typeof budgetRemaining === 'number'
          ? budgetRemaining
          : Number(budget) - transportCost - accommodationCost;

      const emissions = computeEmissions(transportSegments, normalizedItinerary);

      const warnings = [];
      if (overnight && avoidNightTravel) {
        warnings.push('Overnight travel detected despite avoidNightTravel preference');
      }

      finalDocs.push({
        from,
        to,
        startDate,
        deadline,
        budget,
        userID,
        plan_name: plan.plan_name,
        plan_rationale: plan.plan_rationale,
        itinerary: normalizedItinerary,
        total_cost_accommodation_activities: accommodationCost,
        plan: transportSegments,
        totalCost: transportCost,
        budgetRemaining: remaining,
        travelSelection: safeTravelSelection,
        sideLocations: safeSideLocations,
        warnings,
        emissions
      });
    }

    // ---------- 5. DATABASE SAVE ----------
    const saved = await Trip.insertMany(finalDocs);
    res.status(201).json(saved);

  } catch (err) {
    const apiMessage = err.response?.data?.error?.message || err.message || '';
    const apiStatus = err.response?.data?.error?.status || '';
    const modelNotFound = /not found|supported for generateContent/i.test(apiMessage);
    const quotaHit = apiStatus === 'RESOURCE_EXHAUSTED' || /quota exceeded/i.test(apiMessage);
    const isTimeout = err.code === 'ECONNABORTED' || /timeout/i.test(apiMessage);

    if (modelNotFound || quotaHit || isTimeout) {
      try {
        const fallback = buildFallbackPlan({
          from,
          to,
          startDate,
          deadline,
          budget,
          outboundCost,
          returnCost,
          safeSideLocations,
          avoidNightTravel
        });

        const emissions = computeEmissions(fallback.plan, fallback.itinerary);
        const saved = await Trip.insertMany([
          {
            from,
            to,
            startDate,
            deadline,
            budget,
            userID,
            plan_name: fallback.plan_name,
            plan_rationale: fallback.plan_rationale,
            itinerary: fallback.itinerary,
            total_cost_accommodation_activities: fallback.total_cost_accommodation_activities,
            plan: fallback.plan,
            totalCost: outboundCost + returnCost,
            budgetRemaining: Number(budget) - outboundCost - returnCost - fallback.total_cost_accommodation_activities,
            travelSelection: safeTravelSelection,
            sideLocations: safeSideLocations,
            warnings: fallback.warnings,
            emissions
          }
        ]);

        return res.status(201).json(saved);
      } catch (fallbackErr) {
        console.error('Fallback trip generation failed:', fallbackErr.message || fallbackErr);
      }
    }

    console.error("Error generating trip:", err.response?.data || err.message);
    return res.status(500).json({
      error: 'Trip generation failed',
      message: apiMessage
    });
  }
});

module.exports = router;