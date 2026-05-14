// ============================================================
// Main App — Lake Erie Fishing Dashboard
// ============================================================

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// Viewport-aware hook — drives mobile-friendly layout decisions.
function useViewport() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { width: w, isMobile: w < 720, isTablet: w >= 720 && w < 1000 };
}

const TABS = [
  { id: "spots",      icon: "🎣", label: "LAKE SPOTS" },
  { id: "ponds",      icon: "🪣", label: "STOCKED PONDS" },
  { id: "species",    icon: "🐟", label: "SPECIES" },
  { id: "conditions", icon: "🌊", label: "CONDITIONS" }
];

function App() {
  const vp = useViewport();
  const [tab, setTab] = useState("spots");
  const [buoyId, setBuoyId] = useState("45203");
  const [buoy, setBuoy] = useState(null);
  const [buoyLoading, setBuoyLoading] = useState(true);
  const [buoyError, setBuoyError] = useState(null);

  // Live weather (Open-Meteo, CORS-friendly, no key)
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // 5-day forecast (Open-Meteo daily)
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [forecastError, setForecastError] = useState(null);

  // Angler mode — drives game plan tactics
  const [mode, setMode] = useState("both"); // "shore" | "boat" | "both"

  const [zip, setZip] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [zipLoc, setZipLoc] = useState(null);
  const [zipError, setZipError] = useState(null);
  const [zipLoading, setZipLoading] = useState(false);

  const [speciesFilter, setSpeciesFilter] = useState("");

  // Species detail modal — set to a species object when open, null when closed
  const [openSpecies, setOpenSpecies] = useState(null);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const monthIdx = now.getMonth();
  const monthName = window.MONTHS[monthIdx];
  const season = window.SEASONAL[monthIdx];
  const period = window.currentPeriod(now);
  const next = window.nextPeriod(now);
  const minsUntilNext = window.minutesUntilNextPeriod(now);

  const station = useMemo(() =>
    window.BUOYS_FLAT.find(b => b.id === buoyId) || window.BUOYS_FLAT[0],
    [buoyId]
  );

  // Buoy fetch
  useEffect(() => {
    let cancelled = false;
    setBuoyLoading(true);
    setBuoyError(null);
    window.fetchBuoy(buoyId)
      .then(b => { if (!cancelled) { setBuoy(b); setBuoyLoading(false); } })
      .catch(e => {
        if (!cancelled) {
          setBuoy(window.seasonalBuoy(monthIdx));
          setBuoyError(String(e.message || e).slice(0, 60));
          setBuoyLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [buoyId, monthIdx]);

  // Weather fetch — prefer the user's zip location, fall back to the selected buoy
  const weatherCoords = useMemo(() => {
    if (zipLoc) return { lat: zipLoc.lat, lng: zipLoc.lng };
    if (station) return { lat: station.lat, lng: station.lng };
    return null;
  }, [zipLoc, station]);

  useEffect(() => {
    if (!weatherCoords) return;
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(null);
    window.fetchWeather(weatherCoords.lat, weatherCoords.lng)
      .then(w => { if (!cancelled) { setWeather(w); setWeatherLoading(false); } })
      .catch(e => {
        if (!cancelled) {
          setWeather(null);
          setWeatherError(String(e.message || e).slice(0, 60));
          setWeatherLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [weatherCoords?.lat, weatherCoords?.lng]);

  // 5-day forecast fetch — same coords as weather
  useEffect(() => {
    if (!weatherCoords) return;
    let cancelled = false;
    setForecastLoading(true);
    setForecastError(null);
    window.fetchForecast(weatherCoords.lat, weatherCoords.lng, 5)
      .then(days => {
        if (cancelled) return;
        // Annotate each day with its computed species ratings + top species
        const annotated = days.map(d => ({
          ...d,
          computed: window.computeForecastDay(d)
        }));
        setForecast(annotated);
        setForecastLoading(false);
      })
      .catch(e => {
        if (!cancelled) {
          setForecast(null);
          setForecastError(String(e.message || e).slice(0, 60));
          setForecastLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [weatherCoords?.lat, weatherCoords?.lng]);

  // Ratings
  const speciesRatings = useMemo(() =>
    window.computeSpeciesRatings(monthIdx, period, buoy),
    [monthIdx, period, buoy]
  );
  const topSpecies = useMemo(() => window.computeTopSpecies(speciesRatings, 3), [speciesRatings]);

  // Best overall spot (unfiltered, by current rating) — used by the Game Plan widget
  const spotsRanked = useMemo(() => {
    return window.LAKE_SPOTS
      .map(spot => {
        const rating = window.computeSpotRating(spot, speciesRatings, monthIdx);
        const distance = zipLoc ? window.haversineMi(zipLoc, spot) : null;
        return { ...spot, rating, distance };
      })
      .sort((a, b) => b.rating - a.rating);
  }, [speciesRatings, monthIdx, zipLoc]);

  const gamePlan = useMemo(() =>
    window.generateGamePlan({
      monthName, monthIdx, season, period, buoy, weather,
      topSpecies, speciesRatings, spotsRanked, zipLoc, mode, now
    }),
    [monthName, monthIdx, season, period, buoy, weather, topSpecies, speciesRatings, spotsRanked, zipLoc, mode, now]
  );

  // In pond mode, the headline species should reflect the recommended pond, not the lake.
  const headlineSpecies = useMemo(() => {
    if (mode !== "pond") return topSpecies;
    // Find the top-rated nearby pond (mirrors logic in generatePondPlan)
    const ponds = window.STOCKED_PONDS.map(p => ({
      ...p,
      bite: window.computePondBite(p, speciesRatings, now),
      distance: zipLoc ? window.haversineMi(zipLoc, p) : null
    }));
    let candidates = ponds;
    if (zipLoc) {
      const nearby = ponds.filter(p => p.distance != null && p.distance <= 25);
      if (nearby.length) candidates = nearby;
    }
    candidates.sort((a, b) => {
      if (a.bite.freshStock !== b.bite.freshStock) return a.bite.freshStock ? -1 : 1;
      return b.bite.score - a.bite.score;
    });
    const top = candidates[0];
    if (!top) return topSpecies;
    const here = (top.species || [])
      .map(name => ({ name, ...(speciesRatings[name] || {}) }))
      .filter(s => s.value != null)
      .sort((a, b) => b.value - a.value);
    return here.length >= 3 ? here : [...here, ...topSpecies.filter(t => !here.find(h => h.name === t.name))].slice(0, 3);
  }, [mode, topSpecies, speciesRatings, zipLoc, now]);

  // Spot ratings & sorting
  const allSpeciesNames = window.SPECIES.map(s => s.name);

  const spotsWithRating = useMemo(() => {
    return window.LAKE_SPOTS.map(spot => {
      const rating = window.computeSpotRating(spot, speciesRatings, monthIdx);
      const distance = zipLoc ? window.haversineMi(zipLoc, spot) : null;
      return { ...spot, rating, distance };
    });
  }, [speciesRatings, monthIdx, zipLoc]);

  const filteredSpots = useMemo(() => {
    let s = spotsWithRating.slice();
    if (speciesFilter) {
      s = s.filter(sp => sp.species.includes(speciesFilter));
    }
    if (zipLoc) s.sort((a, b) => a.distance - b.distance);
    else s.sort((a, b) => b.rating - a.rating);
    return s;
  }, [spotsWithRating, speciesFilter, zipLoc]);

  const pondsWithDistance = useMemo(() => {
    let p = window.STOCKED_PONDS.map(pond => ({
      ...pond,
      distance: zipLoc ? window.haversineMi(zipLoc, pond) : null,
      bite: window.computePondBite(pond, speciesRatings, now)
    }));
    if (zipLoc) p.sort((a, b) => a.distance - b.distance);
    else p.sort((a, b) => b.bite.score - a.bite.score);
    return p;
  }, [zipLoc, speciesRatings, now]);

  // Zip handler
  function handleZip(e) {
    e.preventDefault();
    const z = zipInput.trim();
    if (!/^\d{5}$/.test(z)) {
      setZipError("5-digit zip");
      return;
    }
    setZipError(null);
    setZipLoading(true);
    window.fetchZip(z)
      .then(loc => {
        setZipLoc(loc); setZip(z); setZipLoading(false);
      })
      .catch(e => {
        setZipError("not found"); setZipLoading(false);
      });
  }

  function clearZip() {
    setZip(""); setZipInput(""); setZipLoc(null); setZipError(null);
  }

  return (
    <div data-rt-app style={{ minHeight: "100vh", padding: vp.isMobile ? "14px 12px 40px" : "24px 20px 60px", maxWidth: 1340, margin: "0 auto" }}>
      <Header now={now} monthName={monthName} season={season} period={period} vp={vp} />

      {/* Live conditions block */}
      <div data-rt-stack style={{
        display: "grid",
        gridTemplateColumns: vp.isMobile ? "1fr" : "minmax(0, 2fr) minmax(0, 1fr)",
        gap: vp.isMobile ? 12 : 16,
        marginBottom: vp.isMobile ? 12 : 16
      }}>
        <window.BuoyCard
          buoy={buoy}
          station={station}
          loading={buoyLoading}
          error={buoyError}
          monthName={monthName}
          weather={weather}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
        />
        <window.PeriodCard period={period} next={next} minutesUntilNext={minsUntilNext} />
      </div>

      {/* Today's Game Plan */}
      <window.GamePlanCard
        plan={gamePlan}
        topSpecies={headlineSpecies}
        period={period}
        monthName={monthName}
        weather={weather}
        mode={mode}
        onModeChange={setMode}
      />

      {/* Today's sun, moon, and bite windows */}
      <window.SunMoonCard
        now={now}
        lat={weatherCoords?.lat}
        lng={weatherCoords?.lng}
        locationName={zipLoc ? `${zipLoc.city}, ${zipLoc.state}` : station?.name}
        vp={vp}
      />

      {/* 5-day bite forecast */}
      <window.ForecastCard
        days={forecast}
        loading={forecastLoading}
        error={forecastError}
        locationName={zipLoc ? `${zipLoc.city}, ${zipLoc.state}` : station?.name}
        onSpeciesClick={setOpenSpecies}
      />

      {/* Controls row */}
      <div data-rt-stack style={{
        display: "grid",
        gridTemplateColumns: vp.isMobile ? "1fr" : "minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr)",
        gap: vp.isMobile ? 10 : 12,
        marginBottom: vp.isMobile ? 12 : 16,
        alignItems: "stretch"
      }}>
        <Control label="Buoy">
          <select
            value={buoyId}
            onChange={e => setBuoyId(e.target.value)}
            style={selectStyle}
          >
            <optgroup label="🎯 Nearshore (CWA Smart Lake Erie)">
              {window.BUOYS.nearshore.map(b => (
                <option key={b.id} value={b.id}>{b.id} — {b.name}</option>
              ))}
            </optgroup>
            <optgroup label="🌊 Offshore">
              {window.BUOYS.offshore.map(b => (
                <option key={b.id} value={b.id}>{b.id} — {b.name}</option>
              ))}
            </optgroup>
            <optgroup label="📍 Coastal NWS">
              {window.BUOYS.coastal.map(b => (
                <option key={b.id} value={b.id}>{b.id} — {b.name}</option>
              ))}
            </optgroup>
          </select>
        </Control>

        <Control label={zipLoc ? `Sorting by distance from ${zipLoc.city}, ${zipLoc.state}` : "Sort by distance from zip"}>
          <form onSubmit={handleZip} style={{ display: "flex", gap: 6 }}>
            <input
              value={zipInput}
              onChange={e => setZipInput(e.target.value)}
              placeholder={zipLoc ? zipLoc.zip : "e.g. 44012"}
              maxLength={5}
              style={{ ...inputStyle, flex: 1 }}
            />
            {zipLoc ? (
              <button type="button" onClick={clearZip} style={btnStyle("danger")}>Clear</button>
            ) : (
              <button type="submit" disabled={zipLoading} style={btnStyle()}>
                {zipLoading ? "…" : "Set"}
              </button>
            )}
          </form>
          {zipError && <div style={{ color: "#e8a8a8", fontSize: 11, marginTop: 4, fontFamily: "'Share Tech Mono', monospace" }}>⚠ {zipError}</div>}
        </Control>

        <Control label="Filter species">
          <select
            value={speciesFilter}
            onChange={e => setSpeciesFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">All species</option>
            {allSpeciesNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Control>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 18 }}>
        <window.TabBar tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === "spots" && (
        <SpotsTab spots={filteredSpots} zipLoc={zipLoc} speciesFilter={speciesFilter} onSpeciesClick={setOpenSpecies} />
      )}
      {tab === "ponds" && (
        <PondsTab ponds={pondsWithDistance} zipLoc={zipLoc} onSpeciesClick={setOpenSpecies} />
      )}
      {tab === "species" && (
        <SpeciesTab speciesRatings={speciesRatings} onSpeciesClick={setOpenSpecies} />
      )}
      {tab === "conditions" && (
        <ConditionsTab
          buoy={buoy}
          monthIdx={monthIdx}
          monthName={monthName}
          season={season}
          period={period}
          speciesRatings={speciesRatings}
          topSpecies={topSpecies}
        />
      )}

      <Footer />

      {/* Species detail modal */}
      <window.SpeciesModal
        species={openSpecies}
        rating={openSpecies ? speciesRatings[openSpecies.name]?.value : null}
        onClose={() => setOpenSpecies(null)}
      />
    </div>
  );
}

// ---------- Header ----------
function Header({ now, monthName, season, period, vp }) {
  const isMobile = vp?.isMobile;
  return (
    <header style={{ marginBottom: isMobile ? 14 : 18 }}>
      <div data-rt-flex-stack style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: isMobile ? 8 : 12 }}>
        <div>
          <div style={{ color: "#7ec4cf", fontFamily: "'Share Tech Mono', monospace", fontSize: isMobile ? 9 : 11, letterSpacing: isMobile ? 1.5 : 3, marginBottom: 4 }}>
            LAKE ERIE · {isMobile ? "S. SHORE" : "SOUTHERN SHORELINE · SANDUSKY → CLEVELAND"}
          </div>
          <h1 data-rt-h1 style={{
            margin: 0,
            fontFamily: "'Bitter', serif",
            fontSize: isMobile ? 28 : 38,
            color: "#f0f4f8",
            fontWeight: 700,
            letterSpacing: -0.5,
            lineHeight: 1.05
          }}>
            Reef <span style={{ color: "#7ec4cf", fontStyle: "italic" }}>&amp;</span> Tide
          </h1>
          <div style={{ color: "#a8b8c8", fontFamily: "'Bitter', serif", fontSize: isMobile ? 12 : 14, marginTop: 4, fontStyle: "italic" }}>
            South-shore fishing forecast · live buoys · seasonal intelligence
          </div>
        </div>
        <div data-rt-header-right style={{ textAlign: isMobile ? "left" : "right", width: isMobile ? "100%" : "auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#7c93ad", letterSpacing: 2 }}>
            {now.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Bitter', serif", fontSize: isMobile ? 16 : 18, color: "#dbe3ec", marginTop: 2 }}>
            {monthName} · <span style={{ color: "#7ec4cf" }}>{period.name}</span>
          </div>
          <div style={{ color: "#7c93ad", fontSize: 12, fontFamily: "'Share Tech Mono', monospace", marginTop: 2 }}>
            avg water {season.waterF}°F · {season.wind} {season.windMph}mph
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------- Spots Tab ----------
function SpotsTab({ spots, zipLoc, speciesFilter, onSpeciesClick }) {
  return (
    <div>
      <window.SectionHeading
        kicker={`${window.LAKE_SPOTS.length} PUBLIC ACCESS POINTS`}
        title="Lake Erie Spots"
        sub={
          zipLoc
            ? `Sorted by distance from ${zipLoc.city}, ${zipLoc.state}. Bite rating updates with the buoy & time-of-day.`
            : "Sorted by current bite rating (season + time-of-day + live buoy). Set a zip to sort by distance."
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
        {spots.map((s, i) => (
          <window.SpotCard
            key={s.id}
            spot={s}
            rating={s.rating}
            rank={i + 1}
            distance={s.distance}
            isHot={!zipLoc && i === 0 && s.rating >= 8}
            onSpeciesClick={onSpeciesClick}
          />
        ))}
      </div>
      {!spots.length && (
        <div style={{ color: "#7c93ad", textAlign: "center", padding: 40, fontFamily: "'Bitter', serif" }}>
          No spots match {speciesFilter ? `“${speciesFilter}”` : "your filter"}.
        </div>
      )}
    </div>
  );
}

// ---------- Ponds Tab ----------
function PondsTab({ ponds, zipLoc, onSpeciesClick }) {
  return (
    <div>
      <window.SectionHeading
        kicker="VERIFIED STOCKED WATERS"
        title="Inland Ponds & Reservoirs"
        sub="ODNR District 3 trout stockings · Cleveland Metroparks · Lorain County Metro Parks · State Parks"
      />
      <div style={{
        marginBottom: 16,
        padding: "12px 14px",
        background: "rgba(230,181,74,0.08)",
        border: "1px solid rgba(230,181,74,0.3)",
        borderRadius: 10,
        color: "#e6c87a",
        fontSize: 13,
        fontFamily: "'Bitter', serif",
        lineHeight: 1.55
      }}>
        <strong style={{ color: "#e6b54a", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1 }}>HEADS UP · </strong>
        District 3 trout stocking dates shown are the ODNR 2026 schedule. Dates can shift based on weather and ice conditions — verify before you drive. Other ponds reflect ongoing programs.
        &nbsp;
        <Link href="https://ohiodnr.gov/buy-and-apply/hunting-fishing-boating/fishing-resources/trout-stockings">ODNR Trout Stockings</Link> ·&nbsp;
        <Link href="https://www.clevelandmetroparks.com/parks/visit/activities/fishing">Cleveland Metroparks</Link> ·&nbsp;
        <Link href="https://www.metroparks.cc/">Lorain County Metro Parks</Link> ·&nbsp;
        <Link href="https://www.eriemetroparks.org/">Erie MetroParks</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {ponds.map(p => <window.PondCard key={p.id} pond={p} distance={p.distance} bite={p.bite} onSpeciesClick={onSpeciesClick} />)}
      </div>
    </div>
  );
}

function Link({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#7ec4cf", textDecoration: "underline" }}>{children}</a>;
}

// ---------- Species Tab ----------
function SpeciesTab({ speciesRatings, onSpeciesClick }) {
  // Sort by current rating
  const sorted = useMemo(() => {
    return window.SPECIES.slice().sort((a, b) => {
      const ra = speciesRatings[a.name]?.value ?? 0;
      const rb = speciesRatings[b.name]?.value ?? 0;
      return rb - ra;
    });
  }, [speciesRatings]);

  return (
    <div>
      <window.SectionHeading
        kicker="13 TARGET FISH"
        title="Species Guide"
        sub="Methods, baits, lures, and current bite rating for each."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {sorted.map(s => (
          <window.SpeciesCard
            key={s.name}
            species={s}
            rating={speciesRatings[s.name]?.value}
            onClick={() => onSpeciesClick && onSpeciesClick(s)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- Conditions Tab ----------
function ConditionsTab({ buoy, monthIdx, monthName, season, period, speciesRatings, topSpecies }) {
  const isLive = buoy && !buoy.seasonal;
  return (
    <div>
      <window.SectionHeading
        kicker="DETAIL"
        title="Conditions & Bite Breakdown"
        sub={`Computed from ${isLive ? "live buoy" : "seasonal estimates"} + ${monthName} averages + time-of-day modifiers.`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 20 }}>
        <Panel title="Top Species Right Now">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topSpecies.map((s, i) => {
              const sp = window.SPECIES.find(x => x.name === s.name);
              return (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#7c93ad", fontSize: 14, width: 22 }}>#{i + 1}</div>
                  <span style={{ fontSize: 22 }}>{sp?.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Bitter', serif", color: "#f0f4f8", fontSize: 16 }}>{s.name}</div>
                    <div style={{ color: "#7c93ad", fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>
                      season {s.season} {s.delta >= 0 ? "+" : ""}{s.delta} time-of-day
                    </div>
                  </div>
                  <window.RatingBadge rating={s.value} />
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title={`${monthName} Tip`}>
          <p style={{ color: "#dbe3ec", fontSize: 15, lineHeight: 1.55, margin: 0, fontFamily: "'Bitter', serif", fontStyle: "italic" }}>
            "{season.tip}"
          </p>
        </Panel>

        <Panel title="Right-Now Snapshot">
          <Row k="Air"        v={`${buoy?.airF ?? season.airF}°F`} />
          <Row k="Water"      v={`${buoy?.waterF ?? season.waterF}°F`} />
          <Row k="Wind"       v={`${buoy?.windDir ?? season.wind} ${buoy?.windMph ?? season.windMph} mph`} />
          {buoy?.gustMph != null && <Row k="Gust" v={`${buoy.gustMph} mph`} />}
          <Row k="Waves"      v={`${buoy?.waveFt ?? season.waveFt} ft`} />
          <Row k="Clarity"    v={season.clarity} />
          <Row k="Time"       v={period.name} />
        </Panel>
      </div>

      <Panel title="Per-Species Bite Ratings · Right Now">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "0 24px" }}>
          {window.SPECIES.map(s => {
            const r = speciesRatings[s.name];
            if (!r) return null;
            return (
              <window.RatingBar
                key={s.name}
                value={r.value}
                delta={r.delta}
                label={s.name}
                color={s.color}
              />
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(14,28,50,0.85), rgba(8,18,34,0.85))",
      border: "1px solid rgba(126,196,207,0.18)",
      borderRadius: 14,
      padding: 18,
      marginBottom: 14
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#7ec4cf", fontSize: 11, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "6px 0",
      borderBottom: "1px dashed rgba(255,255,255,0.06)"
    }}>
      <span style={{ color: "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: 1 }}>{k.toUpperCase()}</span>
      <span style={{ color: "#dbe3ec", fontFamily: "'Bitter', serif", fontSize: 14 }}>{v}</span>
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <div style={{
      marginTop: 32,
      paddingTop: 18,
      borderTop: "1px dashed rgba(126,196,207,0.2)",
      color: "#5d738a",
      fontSize: 11,
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: 1,
      lineHeight: 1.7
    }}>
      DATA · NDBC realtime buoys (noaa.gov) · Zippopotam.us (geocoding) · Wikimedia Commons (imagery)<br/>
      RATINGS are guidance — combining seasonal averages with the current buoy and time of day.
      Verify stocking schedules with ODNR &amp; metroparks directly. Tight lines.
    </div>
  );
}

// ---------- Form chrome ----------
const inputStyle = {
  background: "rgba(8,18,34,0.7)",
  border: "1px solid rgba(126,196,207,0.25)",
  borderRadius: 8,
  padding: "8px 10px",
  color: "#f0f4f8",
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: 13,
  outline: "none"
};
const selectStyle = {
  ...inputStyle,
  width: "100%",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"6\" viewBox=\"0 0 10 6\"><path fill=\"%237ec4cf\" d=\"M0 0l5 6 5-6z\"/></svg>')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 28
};

function btnStyle(kind) {
  const danger = kind === "danger";
  return {
    background: danger ? "rgba(208,88,88,0.15)" : "rgba(126,196,207,0.15)",
    border: `1px solid ${danger ? "rgba(208,88,88,0.4)" : "rgba(126,196,207,0.4)"}`,
    borderRadius: 8,
    color: danger ? "#e8a8a8" : "#a8d1d8",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12,
    letterSpacing: 1,
    padding: "0 14px",
    cursor: "pointer"
  };
}

function Control({ label, children }) {
  return (
    <div style={{
      background: "rgba(8,18,34,0.55)",
      border: "1px solid rgba(126,196,207,0.15)",
      borderRadius: 10,
      padding: "10px 12px"
    }}>
      <div style={{ color: "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// Boot
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
