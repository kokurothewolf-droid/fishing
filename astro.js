// ============================================================
// ASTRONOMY: SUN + MOON + BITE WINDOWS
// Pure math, no external libraries or APIs.
// Accurate to ~1 minute at mid-latitudes (Lake Erie 41–42°N).
// Algorithms adapted from NOAA Solar Calculator + Meeus.
// ============================================================

(function() {
  const PI = Math.PI;
  const rad = PI / 180;
  const dayMs = 86400000;
  const J1970 = 2440588;
  const J2000 = 2451545;
  const e = rad * 23.4397; // Earth's obliquity

  // ---- Julian-date helpers ----
  const toJulian = (date) => date.valueOf() / dayMs - 0.5 + J1970;
  const fromJulian = (j)  => new Date((j + 0.5 - J1970) * dayMs);
  const toDays = (date)   => toJulian(date) - J2000;

  // ---- Sun position helpers ----
  const solarMeanAnomaly = (d) => rad * (357.5291 + 0.98560028 * d);
  const eclipticLongitude = (M) => {
    const C = rad * (1.9148 * Math.sin(M) + 0.0200 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372;
    return M + C + P + PI;
  };
  const declination = (L, b) => Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(L));

  const julianCycle = (d, lw) => Math.round(d - 0.0009 - lw / (2 * PI));
  const approxTransit = (Ht, lw, n) => 0.0009 + (Ht + lw) / (2 * PI) + n;
  const solarTransitJ = (ds, M, L) => J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const hourAngle = (h, phi, d) =>
    Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)));

  // ---- Public: sunrise / solar noon / sunset ----
  window.calcSunTimes = function(date, lat, lng) {
    const lw = rad * -lng;
    const phi = rad * lat;
    const d = toDays(date);
    const n = julianCycle(d, lw);
    const ds = approxTransit(0, lw, n);
    const M = solarMeanAnomaly(ds);
    const L = eclipticLongitude(M);
    const dec = declination(L, 0);
    const Jnoon = solarTransitJ(ds, M, L);

    // -0.833° altitude accounts for atmospheric refraction + sun's radius
    const w = hourAngle(rad * -0.833, phi, dec);
    const a = approxTransit(w, lw, n);
    const sunsetJ = solarTransitJ(a, M, L);
    const sunriseJ = Jnoon - (sunsetJ - Jnoon);

    return {
      sunrise: fromJulian(sunriseJ),
      solarNoon: fromJulian(Jnoon),
      sunset: fromJulian(sunsetJ),
      dayLengthHours: (sunsetJ - sunriseJ) * 24
    };
  };

  // ---- Public: moon phase + illumination ----
  window.calcMoonPhase = function(date) {
    // Reference new moon: Jan 6, 2000 18:14:00 UTC
    const knownNew = Date.UTC(2000, 0, 6, 18, 14);
    const synodic = 29.53058867; // days per lunar cycle
    const days = (date.valueOf() - knownNew) / dayMs;
    let phase = (days / synodic) % 1;
    if (phase < 0) phase += 1;
    const illumination = (1 - Math.cos(phase * 2 * PI)) / 2;
    const waxing = phase < 0.5;

    let name, emoji;
    if (phase < 0.03 || phase > 0.97)      { name = "New Moon";        emoji = "🌑"; }
    else if (phase < 0.22)                  { name = "Waxing Crescent"; emoji = "🌒"; }
    else if (phase < 0.28)                  { name = "First Quarter";   emoji = "🌓"; }
    else if (phase < 0.47)                  { name = "Waxing Gibbous";  emoji = "🌔"; }
    else if (phase < 0.53)                  { name = "Full Moon";       emoji = "🌕"; }
    else if (phase < 0.72)                  { name = "Waning Gibbous";  emoji = "🌖"; }
    else if (phase < 0.78)                  { name = "Last Quarter";    emoji = "🌗"; }
    else                                    { name = "Waning Crescent"; emoji = "🌘"; }

    return { phase, illumination, name, emoji, waxing };
  };

  // ---- Public: bite windows for the date ----
  // Dawn and dusk are the universal walleye/bass prime times.
  // Full/new moons get a bonus midnight window (the "moon bite").
  window.calcBiteWindows = function(date, lat, lng) {
    const sun = window.calcSunTimes(date, lat, lng);
    const moon = window.calcMoonPhase(date);

    const windows = [
      {
        id: "dawn",
        name: "Dawn Bite",
        start: new Date(sun.sunrise.valueOf() - 30 * 60_000),
        end:   new Date(sun.sunrise.valueOf() + 90 * 60_000),
        emoji: "🌅",
        rating: 9,
        note: "Low light · walleye, bass, and trout are most active"
      },
      {
        id: "dusk",
        name: "Dusk Bite",
        start: new Date(sun.sunset.valueOf() - 90 * 60_000),
        end:   new Date(sun.sunset.valueOf() + 30 * 60_000),
        emoji: "🌇",
        rating: 9,
        note: "Second prime window · same fish, often bigger"
      }
    ];

    // Moon bonus: near-full or near-new moons add a night peak around solar midnight
    if (moon.illumination > 0.92 || moon.illumination < 0.08) {
      const midnight = new Date(sun.solarNoon.valueOf() + 12 * 3600_000);
      windows.push({
        id: "moon",
        name: moon.illumination > 0.5 ? "Full Moon Window" : "New Moon Window",
        start: new Date(midnight.valueOf() - 90 * 60_000),
        end:   new Date(midnight.valueOf() + 90 * 60_000),
        emoji: moon.emoji,
        rating: 8,
        note: "Solunar peak — predators feed strongly under bright/dark extremes",
        moonBonus: true
      });
    }

    windows.sort((a, b) => a.start - b.start);
    return windows;
  };
})();
