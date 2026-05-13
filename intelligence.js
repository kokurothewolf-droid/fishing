// ============================================================
// Intelligence Engine — NOAA fetch, time-of-day, season,
// zip distance, rating computation.
// ============================================================

window.RATING_TIERS = [
  { min: 8, label: "HOT",  color: "#3fb564", bg: "rgba(63,181,100,0.14)", border: "rgba(63,181,100,0.45)" },
  { min: 6, label: "GOOD", color: "#e6b54a", bg: "rgba(230,181,74,0.14)", border: "rgba(230,181,74,0.45)" },
  { min: 4, label: "FAIR", color: "#e08a3f", bg: "rgba(224,138,63,0.14)", border: "rgba(224,138,63,0.45)" },
  { min: 1, label: "SLOW", color: "#d05858", bg: "rgba(208,88,88,0.14)", border: "rgba(208,88,88,0.45)" }
];

window.tierFor = function(rating) {
  const r = Math.max(1, Math.min(10, Math.round(rating)));
  return window.RATING_TIERS.find(t => r >= t.min) || window.RATING_TIERS[window.RATING_TIERS.length - 1];
};

// ---------- TIME-OF-DAY ----------
window.currentPeriod = function(date = new Date()) {
  const h = date.getHours();
  return window.TIME_PERIODS.find(p => {
    if (p.start < p.end) return h >= p.start && h < p.end;
    return h >= p.start || h < p.end;
  }) || window.TIME_PERIODS[3];
};

window.nextPeriod = function(date = new Date()) {
  const cur = window.currentPeriod(date);
  const idx = window.TIME_PERIODS.findIndex(p => p.name === cur.name);
  return window.TIME_PERIODS[(idx + 1) % window.TIME_PERIODS.length];
};

window.minutesUntilNextPeriod = function(date = new Date()) {
  const cur = window.currentPeriod(date);
  const h = date.getHours();
  const m = date.getMinutes();
  let endHour = cur.end;
  // Convert to a "minutes from now" — handles wraparound
  let curMin = h * 60 + m;
  let endMin = endHour * 60;
  if (cur.end <= cur.start) {
    // wraps midnight (e.g. Late Night 0-4 starts at 0)
    endMin = cur.end * 60;
  }
  let diff = endMin - curMin;
  if (diff <= 0) diff += 24 * 60;
  return diff;
};

// ---------- COMPUTE RATINGS ----------
window.computeSpeciesRatings = function(monthIdx, period, buoy) {
  const season = window.SEASONAL[monthIdx];
  const base = season.ratings;
  const out = {};
  Object.keys(base).forEach(name => {
    const seasonR = base[name] || 0;
    const mod = period.mods[name] ?? 0;
    let val = seasonR + mod;
    // Live buoy fine-tune: high wind hurts shore bite for most species; cold-water bonus for steelhead/trout
    if (buoy && buoy.windMph != null) {
      if (buoy.windMph > 18) val -= 1;
      if (buoy.windMph > 25) val -= 1;
    }
    if (buoy && buoy.waterF != null) {
      if ((name === "Steelhead" || name === "Rainbow Trout") && buoy.waterF < 55) val += 1;
      if ((name === "Walleye") && buoy.waterF >= 40 && buoy.waterF <= 60) val += 1;
      if ((name === "Smallmouth Bass" || name === "Largemouth Bass") && buoy.waterF > 75) val -= 1;
      if ((name === "Bluegill" || name === "Crappie") && buoy.waterF < 55) val -= 1;
    }
    out[name] = { value: Math.max(1, Math.min(10, val)), delta: mod, season: seasonR };
  });
  return out;
};

window.computeTopSpecies = function(ratings, n = 3) {
  return Object.entries(ratings)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, n)
    .map(([name, r]) => ({ name, ...r }));
};

window.computeSpotRating = function(spot, speciesRatings, monthIdx) {
  // weighted avg of the spot's species ratings
  const vals = spot.species.map(s => speciesRatings[s]?.value ?? 5);
  if (!vals.length) return spot.baseRating;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  // Blend with spot's intrinsic baseRating
  return Math.max(1, Math.min(10, (avg * 0.7 + spot.baseRating * 0.3)));
};

// ---------- NOAA NDBC BUOY FETCH ----------
// NDBC doesn't send CORS headers, so we try direct first (in case it works),
// then fall through a chain of public CORS proxies. Whichever succeeds wins.
// `source` is attached to the parsed result so the UI can show how we got it.
window.BUOY_SOURCES = [
  { label: "direct",      url: (id) => `https://www.ndbc.noaa.gov/data/realtime2/${id}.txt` },
  { label: "corsproxy.io", url: (id) => `https://corsproxy.io/?${encodeURIComponent(`https://www.ndbc.noaa.gov/data/realtime2/${id}.txt`)}` },
  { label: "allorigins",   url: (id) => `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.ndbc.noaa.gov/data/realtime2/${id}.txt`)}` },
  { label: "codetabs",     url: (id) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(`https://www.ndbc.noaa.gov/data/realtime2/${id}.txt`)}` }
];

// Format: space-delimited columns.
// First line = headers, second = units, then data rows (newest first).
window.fetchBuoy = async function(stationId) {
  const errors = [];
  for (const src of window.BUOY_SOURCES) {
    try {
      // 6 second timeout per source so a hanging proxy doesn't block the chain
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(src.url(stationId), { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`${src.label} ${res.status}`);
      const txt = await res.text();
      if (!txt || txt.length < 50) throw new Error(`${src.label} empty`);
      const parsed = window.parseBuoy(txt);
      parsed.source = src.label;
      return parsed;
    } catch (e) {
      errors.push(`${src.label}:${(e.message || e).toString().slice(0, 30)}`);
    }
  }
  throw new Error(`all sources failed (${errors.join(" / ")})`);
};

window.parseBuoy = function(txt) {
  const lines = txt.split("\n").filter(Boolean);
  if (lines.length < 3) throw new Error("buoy: empty");
  const headers = lines[0].replace(/^#/, "").trim().split(/\s+/);
  // skip line[1] = units
  // first data row = lines[2] (most recent)
  const row = lines[2].trim().split(/\s+/);
  const get = (key) => {
    const idx = headers.indexOf(key);
    if (idx < 0) return null;
    const v = row[idx];
    if (v == null || v === "MM" || v === "999" || v === "99.0") return null;
    const n = parseFloat(v);
    return isFinite(n) ? n : null;
  };
  const yr = parseInt(row[0], 10);
  const mo = parseInt(row[1], 10);
  const dy = parseInt(row[2], 10);
  const hr = parseInt(row[3], 10);
  const mn = parseInt(row[4], 10);
  const obs = new Date(Date.UTC(yr, mo - 1, dy, hr, mn));
  const airC = get("ATMP");
  const waterC = get("WTMP");
  const wspdMs = get("WSPD");
  const gustMs = get("GST");
  const wdir = get("WDIR");
  const wvht = get("WVHT");
  const pres = get("PRES");
  return {
    observedAt: obs,
    airF: airC != null ? Math.round((airC * 9) / 5 + 32) : null,
    waterF: waterC != null ? Math.round((waterC * 9) / 5 + 32) : null,
    windMph: wspdMs != null ? Math.round(wspdMs * 2.23694) : null,
    gustMph: gustMs != null ? Math.round(gustMs * 2.23694) : null,
    windDeg: wdir,
    windDir: wdir != null ? window.degToCompass(wdir) : null,
    waveFt: wvht != null ? +(wvht * 3.28084).toFixed(1) : null,
    pressureMb: pres
  };
};

window.degToCompass = function(deg) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
};

// ---------- ZIP DISTANCE ----------
window.fetchZip = async function(zip) {
  const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!res.ok) throw new Error("zip not found");
  const data = await res.json();
  const place = data.places && data.places[0];
  if (!place) throw new Error("zip missing place");
  return {
    zip,
    city: place["place name"],
    state: place["state abbreviation"],
    lat: parseFloat(place.latitude),
    lng: parseFloat(place.longitude)
  };
};

// Haversine distance in miles
window.haversineMi = function(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

// ---------- OPEN-METEO WEATHER FETCH (CORS-enabled, no key needed) ----------
window.fetchWeather = async function(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}`
    + `&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,relative_humidity_2m,pressure_msl,is_day`
    + `&hourly=precipitation_probability,temperature_2m,cloud_cover`
    + `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_hours=12`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = await res.json();
  const c = data.current;
  // Find precipitation probability for the current/next hour
  let precipProb = null;
  if (data.hourly && data.hourly.precipitation_probability) {
    precipProb = Math.max(...data.hourly.precipitation_probability.slice(0, 3).filter(v => v != null));
    if (!isFinite(precipProb)) precipProb = null;
  }
  return {
    tempF: Math.round(c.temperature_2m),
    feelsF: Math.round(c.apparent_temperature),
    precipIn: c.precipitation || 0,
    precipProb,
    weatherCode: c.weather_code,
    sky: window.weatherCodeToText(c.weather_code),
    skyIcon: window.weatherCodeToIcon(c.weather_code, c.is_day === 1),
    windMph: Math.round(c.wind_speed_10m),
    gustMph: c.wind_gusts_10m != null ? Math.round(c.wind_gusts_10m) : null,
    windDir: window.degToCompass(c.wind_direction_10m),
    cloudPct: Math.round(c.cloud_cover),
    humidity: Math.round(c.relative_humidity_2m),
    pressureMb: c.pressure_msl,
    isDay: c.is_day === 1,
    observedAt: new Date(c.time)
  };
};

window.weatherCodeToText = function(code) {
  if (code === 0) return "clear";
  if (code <= 2) return "partly cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "foggy";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "showers";
  if (code >= 85 && code <= 86) return "snow showers";
  if (code >= 95) return "thunderstorm";
  return "mixed";
};

window.weatherCodeToIcon = function(code, isDay) {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "⛅" : "☁️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "🌨️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌥️";
};

// ---------- BOAT TIPS BY MONTH (Lake Erie south shore) ----------
window.BOAT_TIPS_BY_MONTH = [
  // Jan
  "Most ramps are iced in or pulled. If you can launch, focus rivermouth plumes for steelhead.",
  // Feb
  "Lake ramps still tough; tributary mouths (Vermilion, Rocky) hold staged steelhead.",
  // Mar
  "Western basin reefs (Niagara, Crib, Round) heat up for walleye on jerkbaits in 8–15 ft. Launch Catawba or Mazurik.",
  // Apr
  "Jig walleye on the western reefs in 12–20 ft. Smallmouth start hitting on breakwall rip-rap.",
  // May
  "Walleye scatter east — troll #5 Husky Jerks and small spoons in 18–28 ft from Huron east. Smallies are bedding on rocky structure.",
  // Jun
  "Run worm-harness spreads on planer boards in 25–40 ft. Central basin starts producing limits.",
  // Jul
  "Deep summer pattern — weighted harnesses and deep-divers in 40–55 ft. Stay off the lake when wind exceeds 20 mph.",
  // Aug
  "Same as July, plus yellow perch staging on humps in 35–45 ft. Drop a spreader rig with shiners.",
  // Sep
  "Perch get hot — find 35–50 ft humps off Lorain, Avon Point, and Cleveland intake cribs. Walleye trolling stickbaits at dusk.",
  // Oct
  "Walleye migrate west. Trolling Husky Jerks, Bandits, and Reef Runners in 15–30 ft. Steelhead near tributary plumes.",
  // Nov
  "Big-fish month for trophy walleye. Troll stickbaits in 15–25 ft, often after dark close to shore. Dress for weather.",
  // Dec
  "Late-season trolling near rivermouths and harbors. Most ramps pulled by mid-month — call ahead."
];

// ---------- SEASONAL FALLBACK BUOY ----------
window.seasonalBuoy = function(monthIdx) {
  const s = window.SEASONAL[monthIdx];
  return {
    seasonal: true,
    airF: s.airF,
    waterF: s.waterF,
    windMph: s.windMph,
    windDir: s.wind,
    gustMph: null,
    waveFt: s.waveFt,
    observedAt: null
  };
};

// ---------- GAME PLAN PARAGRAPH ----------
// Synthesizes a friendly recommendation paragraph from the current state.
// mode: 'shore' | 'boat' | 'pond' | 'both' — drives which tactics appear.
// zipLoc: when present, the plan assumes the user wants to stay local (~25 mi).
window.generateGamePlan = function({ monthName, monthIdx, season, period, buoy, weather, topSpecies, speciesRatings, spotsRanked, zipLoc, mode = "both", now = new Date() }) {
  // ---- POND MODE — completely different logic from lake modes ----
  if (mode === "pond") {
    return window.generatePondPlan({ monthName, monthIdx, season, period, weather, speciesRatings, zipLoc, now });
  }

  // Resolve conditions — prefer live buoy water/wave, weather for sky/precip/air
  const water = buoy?.waterF ?? season.waterF;
  const wind  = weather?.windMph ?? buoy?.windMph ?? season.windMph;
  const gust  = weather?.gustMph ?? buoy?.gustMph ?? null;
  const waveFt = buoy?.waveFt ?? season.waveFt;
  const windDir = weather?.windDir || buoy?.windDir || season.wind;
  const isLive = buoy && !buoy.seasonal;
  const sky = weather?.sky;
  const precipProb = weather?.precipProb;
  const cloudPct = weather?.cloudPct;
  const airF = weather?.tempF ?? buoy?.airF ?? season.airF;

  const t1 = topSpecies[0];
  const t2 = topSpecies[1];
  const t3 = topSpecies[2];
  const sp1 = window.SPECIES.find(s => s.name === t1.name);

  // Spot selection — when zip is set, prefer nearest decent-rated spot
  let topSpot = spotsRanked && spotsRanked[0];
  let nearbyNote = "";
  if (zipLoc && spotsRanked) {
    const withDist = spotsRanked
      .map(s => ({ ...s, distance: window.haversineMi(zipLoc, s) }))
      .filter(s => s.distance != null);
    // First try: any spot within 25 mi, sorted by rating
    const nearby = withDist
      .filter(s => s.distance <= 25 && s.rating >= 5)
      .sort((a, b) => b.rating - a.rating);
    if (nearby.length) {
      topSpot = nearby[0];
      nearbyNote = ` within a short drive of ${zipLoc.city}`;
    } else {
      // Fall back to nearest spot regardless of rating
      const sorted = withDist.slice().sort((a, b) => a.distance - b.distance);
      topSpot = sorted[0];
      nearbyNote = ` — closest decent option to ${zipLoc.city}`;
    }
  }

  const sentences = [];

  // 1) Opening — verdict on the top species + sky/temp setting
  const verdict =
    t1.value >= 9 ? "absolutely primed for"
    : t1.value >= 7.5 ? "a strong window for"
    : t1.value >= 6 ? "a workable bite on"
    : t1.value >= 4 ? "a tougher day but still doable for"
    : "a slow day overall — your best long shot is";
  const skyClause = sky ? `, with ${sky} skies and ${airF}°F air,` : "";
  sentences.push(
    `It's ${period.name.toLowerCase()} in ${monthName}${skyClause} and conditions are ${verdict} ${t1.name.toLowerCase()}, with ${t2.name.toLowerCase()} and ${t3.name.toLowerCase()} the next-best targets.`
  );

  // 2) Tactic — prefer a lure, fall back to bait
  const realLure = sp1?.lures?.find(l => l && !/^N\/A/i.test(l));
  const firstBait = sp1?.baits?.[0];
  if (realLure && firstBait) {
    sentences.push(`Start with ${realLure}; if the bite goes quiet, switch to ${firstBait}.`);
  } else if (realLure) {
    sentences.push(`Tie on ${realLure} and work the column until you find them.`);
  } else if (firstBait) {
    sentences.push(`Run ${firstBait} on the bottom — this is a soak-and-wait fish.`);
  }

  // 3) Shore spot recommendation (skip if user is boat-only)
  if (mode !== "boat" && topSpot) {
    const dist = topSpot.distance != null ? ` (${topSpot.distance.toFixed(1)} mi away)` : "";
    const shoreLabel = mode === "both" ? "From shore," : "Best access right now is";
    if (mode === "both") {
      sentences.push(`${shoreLabel} hit ${topSpot.name} in ${topSpot.city}${dist}${nearbyNote}.`);
    } else {
      sentences.push(`${shoreLabel} ${topSpot.name} in ${topSpot.city}${dist}${nearbyNote}.`);
    }
  }

  // 4) Boat tactics (skip if user is shore-only)
  if (mode !== "shore") {
    const boatTip = window.BOAT_TIPS_BY_MONTH[monthIdx];
    const launches = [];
    if (zipLoc) {
      // Find the closest 1–2 spots that are marinas/harbors with realistic boat access
      const launchTypes = /Marina|Harbor|State Park|River Mouth/i;
      const possible = (spotsRanked || window.LAKE_SPOTS)
        .filter(s => launchTypes.test(s.type || ""))
        .map(s => ({ ...s, distance: window.haversineMi(zipLoc, s) }))
        .sort((a, b) => a.distance - b.distance);
      if (possible[0]) launches.push(`${possible[0].name} (${possible[0].distance.toFixed(1)} mi)`);
    }
    const launchClause = launches.length ? ` Closest ramp: ${launches[0]}.` : "";
    const boatPrefix = mode === "both" ? "From a boat:" : "On the water:";
    sentences.push(`${boatPrefix} ${boatTip}${launchClause}`);
  }

  // 5) Conditions caveats — wind/waves/temp/precip
  const caveats = [];
  if (wind >= 22 || waveFt >= 4 || (gust && gust >= 30)) {
    if (mode === "boat") {
      caveats.push(`small-craft conditions — ${wind} mph ${windDir}${gust ? ` gusting ${gust}` : ""}, ${waveFt}-ft chop. Stay tucked behind breakwalls or wait it out`);
    } else if (mode === "shore") {
      caveats.push(`${wind} mph ${windDir} winds with ${waveFt}-ft chop — west-facing piers will be a wet mess; look for east-facing or harbor shelter`);
    } else {
      caveats.push(`big water is rough today (${wind} mph ${windDir}${gust ? `, gusts ${gust}` : ""}, ${waveFt}-ft chop) — skip the boat, stick to piers, harbors, and river mouths`);
    }
  } else if (wind >= 15 || waveFt >= 3) {
    caveats.push(`${windDir} chop running ${waveFt} ft — fishable from sheltered access, sketchy in a small boat`);
  }
  if (water <= 42) {
    caveats.push(`water is cold at ${water}°F — slow down and fish deep`);
  } else if (water >= 76) {
    caveats.push(`water is warm at ${water}°F — focus dawn, dusk, and after dark`);
  }
  if (precipProb != null && precipProb >= 60) {
    caveats.push(`rain probable (${precipProb}%) — bring layers, but overcast often turns walleye and bass on`);
  } else if (cloudPct != null && cloudPct >= 80 && precipProb < 40) {
    // overcast without rain is a bonus, not a caveat — append a positive note
    sentences.push(`Heavy cloud cover is in your favor — predators stay shallow longer.`);
  }
  if (caveats.length) {
    sentences.push(`Heads up — ${caveats.join("; ")}.`);
  }

  // 6) Honesty note if buoy unreachable
  if (!isLive) {
    sentences.push(`(Buoy data is unreachable — temps and waves are seasonal estimates.)`);
  }

  return sentences.join(" ");
};

// ---------- POND BITE LIKELIHOOD ----------
// Compute a 1–10 bite score for a stocked pond, plus a "fresh stock" flag.
// Uses the species at the pond × current speciesRatings, with a boost when
// trout were stocked recently (rainbows are eager + naive for the first ~14 days).
window.computePondBite = function(pond, speciesRatings, now = new Date()) {
  // Average bite rating of the pond's species, weighted slightly toward trout
  // (since rainbow trout is what most district-3 ponds are stocked for).
  let total = 0, weight = 0;
  for (const sp of pond.species || []) {
    const r = speciesRatings[sp];
    if (!r) continue;
    const w = sp === "Rainbow Trout" ? 1.6 : 1.0;
    total += r.value * w;
    weight += w;
  }
  let score = weight > 0 ? total / weight : 5;

  // Fresh stock bonus: within 14 days after a stocking date, big bite spike
  let freshStock = false;
  let daysSinceStock = null;
  if (pond.stockingDate2026) {
    const m = pond.stockingDate2026.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) {
      const stockDate = new Date(+m[3], +m[1] - 1, +m[2]);
      const ms = now - stockDate;
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      daysSinceStock = days;
      if (days >= 0 && days <= 14) {
        freshStock = true;
        // Closer to stocking date = bigger boost (up to +2.5)
        score = Math.min(10, score + Math.max(0, 2.5 - (days * 0.18)));
      } else if (days > 14 && days <= 30) {
        // Lesser boost: still recently stocked
        score = Math.min(10, score + 0.5);
      }
    }
  }

  const tier =
    score >= 8 ? "HIGH"
    : score >= 6 ? "GOOD"
    : score >= 4 ? "FAIR"
    : "SLOW";

  return { score: +score.toFixed(1), tier, freshStock, daysSinceStock };
};

// ---------- POND GAME PLAN ----------
// Pond fishing is its own world: stocked ponds, calm water, panfish/bass/trout,
// no need for wave/wind caveats. This branch is called from generateGamePlan
// when mode === "pond".
window.generatePondPlan = function({ monthName, monthIdx, season, period, weather, speciesRatings, zipLoc, now = new Date() }) {
  const sentences = [];
  const air = weather?.tempF ?? season.airF;
  const sky = weather?.sky;
  const precipProb = weather?.precipProb;

  // Score every pond, attach distance
  const ponds = window.STOCKED_PONDS.map(p => ({
    ...p,
    bite: window.computePondBite(p, speciesRatings, now),
    distance: zipLoc ? window.haversineMi(zipLoc, p) : null
  }));

  // Candidate set — if zip is set, prefer ponds within 25 mi
  let candidates = ponds;
  if (zipLoc) {
    const nearby = ponds.filter(p => p.distance != null && p.distance <= 25);
    if (nearby.length) candidates = nearby;
  }

  // Sort priority: fresh stock first, then by bite score
  candidates.sort((a, b) => {
    if (a.bite.freshStock !== b.bite.freshStock) return a.bite.freshStock ? -1 : 1;
    return b.bite.score - a.bite.score;
  });

  const topPond = candidates[0];
  if (!topPond) {
    return `No stocked ponds in this dataset for ${monthName}. Check ODNR's trout stocking schedule and Cleveland Metroparks for warm-weather options.`;
  }

  // 1) Lead — name the pond + bite tier
  const distClause = topPond.distance != null ? ` (${topPond.distance.toFixed(1)} mi away)` : "";
  const fresh = topPond.bite.freshStock;
  const leadVerdict =
    topPond.bite.score >= 8 ? "is on fire right now"
    : topPond.bite.score >= 6 ? "is your best pond bet"
    : topPond.bite.score >= 4 ? "is the most workable pond option"
    : "is the most likely pond option (slow conditions overall)";
  sentences.push(
    `${topPond.name} in ${topPond.city}${distClause} ${leadVerdict} — ${topPond.bite.tier.toLowerCase()} bite at ${topPond.bite.score.toFixed(1)}/10.`
  );

  // 2) Fresh stock context
  if (fresh) {
    const d = topPond.bite.daysSinceStock;
    if (d <= 3) {
      sentences.push(`ODNR stocked it ${d === 0 ? "today" : `${d} day${d === 1 ? "" : "s"} ago`} — the rainbows are naive, schooling near the surface, and biting almost anything bright.`);
    } else if (d <= 7) {
      sentences.push(`It was stocked ${d} days ago, so trout are still concentrated and aggressive — expect easy limits.`);
    } else {
      sentences.push(`Stocked ${d} days ago, so the trout have spread out and gotten smarter, but they're still around in good numbers.`);
    }
  } else if (topPond.stockingDate2026) {
    // No fresh boost but a stocking is on the calendar
    const m = topPond.stockingDate2026.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) {
      const stockDate = new Date(+m[3], +m[1] - 1, +m[2]);
      const daysUntil = Math.ceil((stockDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntil > 0 && daysUntil <= 21) {
        sentences.push(`Heads up — this pond gets ODNR's next trout stocking in ${daysUntil} days (${topPond.stockingDate2026}). The bite explodes within hours of release.`);
      }
    }
  }

  // 3) Best species at this pond + tactic
  const speciesHere = (topPond.species || [])
    .map(name => ({ name, ...(speciesRatings[name] || {}) }))
    .filter(s => s.value != null)
    .sort((a, b) => b.value - a.value);
  const top1 = speciesHere[0];
  if (top1) {
    const sp = window.SPECIES.find(s => s.name === top1.name);
    // Prefer pond-friendly tactics
    let tactic;
    if (top1.name === "Rainbow Trout") {
      tactic = fresh
        ? "Float Berkley PowerBait (rainbow or chartreuse) under a small bobber 18–24 in deep, or cast a 1/16 oz inline spinner like a Panther Martin"
        : "Go finesse with a wax worm on a 1/64 oz panfish jig under a slip bobber, or a small inline spinner";
    } else if (top1.name === "Bluegill") {
      tactic = "Red worm or wax worm under a small bobber in 3–6 ft, or a 1/64 oz tungsten jig";
    } else if (top1.name === "Largemouth Bass") {
      tactic = "Wacky-rigged Senko along weed lines, or a small spinnerbait early/late";
    } else if (top1.name === "Channel Catfish") {
      tactic = "Soak chicken liver or cut bait on the bottom near drop-offs at dusk";
    } else if (top1.name === "Crappie") {
      tactic = "Minnow under a slip bobber 4–8 ft deep near brush or wood";
    } else if (sp?.lures?.[0] && !/^N\/A/i.test(sp.lures[0])) {
      tactic = `Tie on ${sp.lures[0]}`;
    } else if (sp?.baits?.[0]) {
      tactic = `Soak ${sp.baits[0]}`;
    }
    if (tactic) {
      sentences.push(`Top species at the pond right now is ${top1.name.toLowerCase()} (${top1.value.toFixed(1)}/10). ${tactic}.`);
    } else {
      sentences.push(`Top species at the pond right now is ${top1.name.toLowerCase()} (${top1.value.toFixed(1)}/10).`);
    }
  }

  // 4) Time-of-day note
  const periodLower = period.name.toLowerCase();
  if (/dawn|morning/.test(periodLower)) {
    sentences.push(`Morning is prime for pond trout and bass — fish the shaded side and any inflow first.`);
  } else if (/midday|afternoon/.test(periodLower)) {
    if (air >= 75) {
      sentences.push(`Midday heat will push trout deeper — work the shaded banks and any aerator/inflow. Bluegill stays aggressive shallow regardless.`);
    } else {
      sentences.push(`Midday is fine for bluegill and catfish; trout get cautious in bright sun so downsize line and presentation.`);
    }
  } else if (/dusk/.test(periodLower)) {
    sentences.push(`Dusk is the second prime window — bass and catfish wake up. Topwater frog or buzzbait if there's any weed cover.`);
  } else if (/night|late/.test(periodLower)) {
    sentences.push(`Night is catfish time — set up with a bait alarm and soak cut bait or stinkbait. Most pond parks close at 11 PM, so check rules.`);
  }

  // 5) Sky/weather note (only when notable)
  if (precipProb != null && precipProb >= 60) {
    sentences.push(`Rain is likely (${precipProb}%) — that's actually good for pond bites, especially on warmwater species. Bring rain gear.`);
  } else if (sky === "clear" && air >= 78) {
    sentences.push(`Bluebird sky and warm air — expect a tougher trout bite during full sun. Move to shaded structure.`);
  }

  // 6) Runner-up pond
  const runner = candidates[1];
  if (runner && runner.bite.score >= 5 && runner.id !== topPond.id) {
    const rd = runner.distance != null ? ` (${runner.distance.toFixed(1)} mi)` : "";
    const freshTag = runner.bite.freshStock ? " — freshly stocked" : "";
    sentences.push(`Backup option: ${runner.name} in ${runner.city}${rd}${freshTag}.`);
  }

  return sentences.join(" ");
};