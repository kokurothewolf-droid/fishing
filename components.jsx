// ============================================================
// UI Components — pure presentational pieces
// ============================================================

const { useState, useEffect, useMemo, useRef } = React;

// ---------- Rating Badge ----------
window.RatingBadge = function RatingBadge({ rating, large, showFire }) {
  const tier = window.tierFor(rating);
  const r = Math.round(rating * 10) / 10;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: large ? "5px 11px" : "3px 8px",
      borderRadius: 999,
      background: tier.bg,
      border: `1px solid ${tier.border}`,
      color: tier.color,
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: large ? 13 : 11,
      letterSpacing: 0.5,
      fontWeight: 600
    }}>
      {showFire && tier.label === "HOT" ? "🔥 " : ""}{tier.label} · {r}
    </span>
  );
};

// ---------- Progress Bar ----------
window.RatingBar = function RatingBar({ value, delta, label, color }) {
  const pct = (Math.max(1, Math.min(10, value)) / 10) * 100;
  const tier = window.tierFor(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{ flex: "0 0 160px", display: "flex", alignItems: "center", gap: 6 }}>
        {color && <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color }} />}
        <span style={{ color: "#dbe3ec", fontSize: 14 }}>{label}</span>
      </div>
      <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{
          width: pct + "%",
          height: "100%",
          background: `linear-gradient(90deg, ${tier.color}aa, ${tier.color})`,
          transition: "width 0.4s ease",
          boxShadow: `0 0 10px ${tier.color}55`
        }} />
      </div>
      <div style={{ flex: "0 0 92px", textAlign: "right", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: tier.color }}>
        {value.toFixed(1)} / 10
        {delta != null && delta !== 0 && (
          <span style={{ marginLeft: 6, color: delta > 0 ? "#5fd28b" : "#d05858", fontSize: 11 }}>
            {delta > 0 ? "+" : ""}{delta}
          </span>
        )}
      </div>
    </div>
  );
};

// ---------- Buoy Report Card ----------
window.BuoyCard = function BuoyCard({ buoy, station, loading, error, monthName, weather, weatherLoading, weatherError }) {
  const isLive = buoy && !buoy.seasonal && !error;
  const isSeasonal = buoy && buoy.seasonal;
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(14,30,54,0.95), rgba(8,18,34,0.95))",
      border: "1px solid rgba(126,196,207,0.25)",
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.3)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1
            }}>
              <LiveDot live={isLive} seasonal={isSeasonal} />
              <span style={{ color: isLive ? "#5fd28b" : isSeasonal ? "#e6b54a" : "#d05858" }}>
                {loading ? "FETCHING…" : isLive ? "LIVE" : isSeasonal ? "SEASONAL" : "OFFLINE"}
              </span>
            </span>
            <span style={{ color: "#7ec4cf", fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
              NDBC · {station?.id}
            </span>
          </div>
          <div style={{ fontFamily: "'Bitter', serif", fontSize: 22, color: "#f0f4f8", fontWeight: 600 }}>
            {station?.name || "Buoy"}
          </div>
          <div style={{ color: "#7c93ad", fontSize: 12, marginTop: 3, fontFamily: "'Share Tech Mono', monospace" }}>
            {buoy?.observedAt
              ? `OBS ${buoy.observedAt.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}${buoy.source && buoy.source !== "direct" ? ` · via ${buoy.source}` : ""}`
              : isSeasonal ? `EST · ${monthName} avg` : "—"}
          </div>
        </div>

        {/* Live sky strip */}
        {(weather || weatherLoading) && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            background: "rgba(126,196,207,0.06)",
            border: "1px solid rgba(126,196,207,0.18)",
            borderRadius: 10,
            minHeight: 50,
            flexShrink: 0
          }}>
            {weatherLoading && !weather ? (
              <span style={{ color: "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
                SKY · LOADING…
              </span>
            ) : weather ? (
              <React.Fragment>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{weather.skyIcon}</span>
                <div>
                  <div style={{ color: "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
                    Sky · {weather.cloudPct}% cloud{weather.precipProb != null ? ` · ${weather.precipProb}% precip` : ""}
                  </div>
                  <div style={{ fontFamily: "'Bitter', serif", color: "#f0f4f8", fontSize: 15, textTransform: "capitalize", marginTop: 2 }}>
                    {weather.sky} · {weather.tempF}°F
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
        <Tile label="Air"     value={buoy?.airF}   unit="°F" />
        <Tile label="Water"   value={buoy?.waterF} unit="°F" hot={buoy?.waterF != null && buoy.waterF >= 60} />
        <Tile label="Wind"    value={buoy?.windMph != null ? `${buoy.windMph} ${buoy.windDir || ""}`.trim() : null} unit="mph" />
        <Tile label="Gust"    value={buoy?.gustMph ?? weather?.gustMph} unit="mph" />
        <Tile label="Waves"   value={buoy?.waveFt}  unit="ft" />
        <Tile label="Humidity" value={weather?.humidity} unit="%" />
      </div>
      {error && (
        <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(208,88,88,0.08)", border: "1px solid rgba(208,88,88,0.3)", borderRadius: 8, color: "#e8a8a8", fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
          Buoy unreachable — using seasonal estimates. ({error})
        </div>
      )}
      {weatherError && !weather && (
        <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(230,181,74,0.06)", border: "1px solid rgba(230,181,74,0.25)", borderRadius: 8, color: "#e6b54a", fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>
          Weather unreachable ({weatherError})
        </div>
      )}
    </div>
  );
};

function LiveDot({ live, seasonal }) {
  const color = live ? "#5fd28b" : seasonal ? "#e6b54a" : "#d05858";
  return (
    <span style={{ position: "relative", display: "inline-block", width: 8, height: 8 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: color,
        boxShadow: `0 0 8px ${color}`,
        animation: live ? "pulseLive 1.6s ease-out infinite" : "none"
      }} />
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: color
      }} />
    </span>
  );
}

function Tile({ label, value, unit, hot }) {
  if (value == null || value === "") return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      padding: "10px 12px"
    }}>
      <div style={{ color: "#7c93ad", fontSize: 10, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "'Bitter', serif", fontSize: 22, color: hot ? "#e6b54a" : "#f0f4f8", fontWeight: 600 }}>{value}</span>
        <span style={{ color: "#7c93ad", fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>{unit}</span>
      </div>
    </div>
  );
}

// ---------- Game Plan Card ----------
// Short, friendly paragraph synthesizing what to fish for right now.
window.GamePlanCard = function GamePlanCard({ plan, topSpecies, period, monthName, weather, mode, onModeChange }) {
  const top = topSpecies[0];
  const sp = window.SPECIES.find(s => s.name === top.name);
  const ratingColor =
    top.value >= 8 ? "#5fd28b" :
    top.value >= 6 ? "#e6b54a" :
    top.value >= 4 ? "#e69a4a" : "#d05858";
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(126,196,207,0.10) 0%, rgba(20,40,72,0.85) 60%, rgba(8,18,34,0.9) 100%)",
      border: "1px solid rgba(126,196,207,0.28)",
      borderRadius: 14,
      padding: "18px 22px 20px",
      marginBottom: 16,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* hairline accent */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${ratingColor}, transparent)`,
        opacity: 0.9
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 240 }}>
          <span style={{
            fontSize: 32,
            lineHeight: 1,
            flexShrink: 0,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
          }}>{sp?.emoji || "🎣"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: "#7ec4cf",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10,
              letterSpacing: 2.5,
              textTransform: "uppercase"
            }}>
              Today's Game Plan · {period.name} · {monthName}
              {weather && <span style={{ color: "#9ab" }}> · {weather.skyIcon} {weather.tempF}°F</span>}
            </div>
            <div style={{
              color: "#f0f4f8",
              fontFamily: "'Bitter', serif",
              fontSize: 22,
              fontWeight: 600,
              marginTop: 3,
              letterSpacing: -0.2
            }}>
              Go for <span style={{ color: ratingColor, fontStyle: "italic" }}>{top.name}</span>
              <span style={{
                marginLeft: 10,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 13,
                color: ratingColor,
                letterSpacing: 1,
                verticalAlign: "middle"
              }}>
                {top.value.toFixed(1)}/10
              </span>
            </div>
          </div>
        </div>

        {/* Mode toggle: Shore / Boat / Both */}
        {onModeChange && (
          <div style={{
            display: "inline-flex",
            border: "1px solid rgba(126,196,207,0.3)",
            borderRadius: 999,
            padding: 3,
            background: "rgba(8,18,34,0.6)",
            flexShrink: 0
          }}>
            {[
              { id: "shore", label: "Shore", icon: "🏖" },
              { id: "boat",  label: "Boat",  icon: "⛵" },
              { id: "pond",  label: "Pond",  icon: "🪣" },
              { id: "both",  label: "Both",  icon: "🎯" }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => onModeChange(opt.id)}
                style={{
                  background: mode === opt.id ? "rgba(126,196,207,0.22)" : "transparent",
                  border: "none",
                  borderRadius: 999,
                  color: mode === opt.id ? "#a8d8df" : "#7c93ad",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 1,
                  padding: "6px 12px",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s"
                }}
                title={`Tips for ${opt.label.toLowerCase()} anglers`}
              >
                <span style={{ marginRight: 4 }}>{opt.icon}</span>{opt.label.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      <p style={{
        margin: 0,
        color: "#dbe3ec",
        fontFamily: "'Bitter', serif",
        fontSize: 15,
        lineHeight: 1.65,
        textWrap: "pretty"
      }}>
        {plan}
      </p>
    </div>
  );
};

// ---------- Now/Next Period Card ----------
window.PeriodCard = function PeriodCard({ period, next, minutesUntilNext }) {
  const mins = minutesUntilNext;
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(67,42,118,0.55), rgba(36,22,68,0.55))",
      border: "1px solid rgba(168,140,232,0.35)",
      borderRadius: 14,
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#c4adff", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1 }}>NOW</span>
        <span style={{ flex: 1, height: 1, background: "rgba(196,173,255,0.2)" }} />
      </div>
      <div style={{ fontFamily: "'Bitter', serif", fontSize: 26, color: "#f0e8ff", fontWeight: 600 }}>{period.name}</div>
      <div style={{ color: "#b9a8e0", fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
        NEXT: {next.name} · in {hh > 0 ? `${hh}h ` : ""}{mm}m
      </div>
    </div>
  );
};

// ---------- Tabs ----------
window.TabBar = function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 4,
      background: "rgba(8,18,34,0.7)",
      border: "1px solid rgba(126,196,207,0.18)",
      borderRadius: 12,
      padding: 4,
      overflowX: "auto"
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              flex: 1,
              minWidth: 110,
              border: "none",
              background: isActive ? "linear-gradient(180deg, rgba(126,196,207,0.18), rgba(126,196,207,0.08))" : "transparent",
              color: isActive ? "#f0f4f8" : "#7c93ad",
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              letterSpacing: 1,
              fontWeight: 600,
              transition: "all 0.2s",
              borderTop: isActive ? "1px solid rgba(126,196,207,0.35)" : "1px solid transparent"
            }}>
            {t.icon} {t.label}
          </button>
        );
      })}
    </div>
  );
};

// ---------- Spot Card ----------
window.SpotCard = function SpotCard({ spot, rating, rank, distance, isHot, onSpeciesClick }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(14,28,50,0.85), rgba(8,18,34,0.85))",
      border: "1px solid rgba(126,196,207,0.18)",
      borderRadius: 14,
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      position: "relative",
      overflow: "hidden"
    }}>
      {isHot && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: "linear-gradient(135deg, #e6b54a, #d97c1f)",
          color: "#1a0f00", padding: "3px 10px",
          fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1,
          borderBottomLeftRadius: 10
        }}>
          🔥 TOP PICK
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingRight: isHot ? 80 : 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 3 }}>
            #{rank} · {spot.type.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Bitter', serif", fontSize: 20, color: "#f0f4f8", fontWeight: 600 }}>
            {spot.name}
          </div>
          <div style={{ color: "#7ec4cf", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, marginTop: 2 }}>
            {spot.city}, OH{distance != null && <> · 📍 {distance.toFixed(1)} mi</>}
          </div>
        </div>
        <window.RatingBadge rating={rating} large />
      </div>
      <p style={{ color: "#c0cad8", fontSize: 13.5, lineHeight: 1.55, margin: 0, fontFamily: "'Bitter', serif" }}>
        {spot.description}
      </p>
      <div style={{ color: "#7c93ad", fontSize: 12, fontFamily: "'Share Tech Mono', monospace", display: "flex", gap: 6, alignItems: "flex-start" }}>
        <span>ACCESS</span>
        <span style={{ color: "#c0cad8" }}>{spot.access}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
        {spot.species.map(s => (
          <window.SpeciesChip key={s} name={s} onClick={onSpeciesClick} compact />
        ))}
      </div>
    </div>
  );
};

// ---------- Pond Card ----------
window.PondCard = function PondCard({ pond, distance, bite, onSpeciesClick }) {
  const isNew2026 = pond.stocking && /NEW for 2026/i.test(pond.stocking);
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(14,28,50,0.85), rgba(8,18,34,0.85))",
      border: `1px solid ${isNew2026 ? "rgba(230,181,74,0.4)" : "rgba(126,196,207,0.18)"}`,
      borderRadius: 14,
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      position: "relative"
    }}>
      {isNew2026 && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(230,181,74,0.18)",
          border: "1px solid rgba(230,181,74,0.5)",
          color: "#f0c870",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: 1.5,
          padding: "3px 8px",
          borderRadius: 999
        }}>NEW · 2026</span>
      )}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ color: "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 1 }}>
            {pond.park.toUpperCase()}
          </div>
          {pond.district === 3 && (
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 9, letterSpacing: 1,
              color: "#7ec4cf",
              background: "rgba(126,196,207,0.1)",
              border: "1px solid rgba(126,196,207,0.3)",
              padding: "1px 6px",
              borderRadius: 999
            }}>D3</span>
          )}
        </div>
        <div style={{ fontFamily: "'Bitter', serif", fontSize: 20, color: "#f0f4f8", fontWeight: 600 }}>
          {pond.name}
        </div>
        <div style={{ color: "#7ec4cf", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, marginTop: 2 }}>
          {pond.city}, OH{distance != null && <> · 📍 {distance.toFixed(1)} mi</>}
        </div>
      </div>
      <div style={{
        background: "rgba(126,196,207,0.05)",
        border: "1px solid rgba(126,196,207,0.15)",
        borderRadius: 8,
        padding: "8px 11px"
      }}>
        <div style={{ color: "#a8d1d8", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 1, marginBottom: 2 }}>STOCKING</div>
        <div style={{ color: "#dbe3ec", fontSize: 13, fontFamily: "'Bitter', serif" }}>{pond.stocking}</div>
      </div>
      {bite && <window.PondBiteBadge bite={bite} />}
      <p style={{ color: "#c0cad8", fontSize: 13, lineHeight: 1.55, margin: 0, fontFamily: "'Bitter', serif" }}>
        {pond.notes}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {pond.species.map(s => (
          <window.SpeciesChip key={s} name={s} onClick={onSpeciesClick} compact />
        ))}
      </div>
    </div>
  );
};

// ---------- Species Card ----------
window.SpeciesCard = function SpeciesCard({ species, rating, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
      background: "linear-gradient(180deg, rgba(14,28,50,0.85), rgba(8,18,34,0.85))",
      border: `1px solid ${species.color}${hover ? "aa" : "55"}`,
      borderRadius: 14,
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      transform: hover && onClick ? "translateY(-2px)" : "none",
      boxShadow: hover && onClick ? `0 12px 30px rgba(0,0,0,0.35), 0 0 0 1px ${species.color}33` : "none",
      transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        height: 140,
        background: imgFailed
          ? `linear-gradient(135deg, ${species.color}33, ${species.color}11)`
          : "#f5f1e8",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {!imgFailed ? (
          <img
            src={species.image}
            loading="lazy"
            onError={() => setImgFailed(true)}
            alt={species.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px 10px" }}
          />
        ) : (
          <span style={{ fontSize: 64 }}>{species.emoji}</span>
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(8,18,34,0.9))` }} />
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          {rating != null && <window.RatingBadge rating={rating} />}
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 26 }}>{species.emoji}</span>
          <span style={{ fontFamily: "'Bitter', serif", fontSize: 22, color: "#f0f4f8", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
            {species.name}
          </span>
        </div>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <Kv label="PEAK"    value={species.peakSeason} />
        <Kv label="METHODS" value={species.methods.join(" · ")} />
        <Kv label="BAITS"   value={species.baits.join(" · ")} />
        <Kv label="LURES"   value={species.lures.join(" · ")} accent={species.color} />
        <p style={{ color: "#c0cad8", fontSize: 12.5, lineHeight: 1.55, margin: 0, fontFamily: "'Bitter', serif", fontStyle: "italic", paddingTop: 4, borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
          {species.notes}
        </p>
      </div>
    </div>
  );
};

function Kv({ label, value, accent }) {
  return (
    <div>
      <div style={{ color: accent || "#7c93ad", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#dbe3ec", fontSize: 12.5, fontFamily: "'Bitter', serif", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

// ---------- Section Heading ----------
window.SectionHeading = function SectionHeading({ kicker, title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {kicker && <div style={{ color: "#7ec4cf", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>{kicker}</div>}
      <div style={{ fontFamily: "'Bitter', serif", fontSize: 26, color: "#f0f4f8", fontWeight: 700 }}>{title}</div>
      {sub && <div style={{ color: "#7c93ad", fontSize: 13, marginTop: 4, fontFamily: "'Bitter', serif" }}>{sub}</div>}
    </div>
  );
};

// Make sure components are globally accessible
Object.assign(window, {
  // Already attached above, but re-declare for clarity
});

// ---------- Sun / Moon / Bite Windows Card ----------
// Full-width strip showing today's astronomy and the prime bite windows.
window.SunMoonCard = function SunMoonCard({ now, lat, lng, locationName }) {
  if (lat == null || lng == null) return null;

  const sun = window.calcSunTimes(now, lat, lng);
  const moon = window.calcMoonPhase(now);
  const windows = window.calcBiteWindows(now, lat, lng);

  const fmtTime = d => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const fmtDur = (start, end) => {
    const mins = Math.round((end - start) / 60_000);
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  // Active window now?
  const activeWindow = windows.find(w => now >= w.start && now <= w.end);

  // Next upcoming window
  const upcoming = windows
    .filter(w => w.start > now)
    .sort((a, b) => a.start - b.start)[0];

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(14,28,50,0.85), rgba(8,18,34,0.85))",
      border: "1px solid rgba(126,196,207,0.2)",
      borderRadius: 14,
      padding: "14px 18px",
      marginBottom: 16,
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)",
      gap: 18,
      alignItems: "stretch"
    }}>
      {/* SUN column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          color: "#e6b54a",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <span style={{ fontSize: 14 }}>☀️</span>
          <span>Sun · {locationName || "Local"}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 10px" }}>
          <SunRow icon="🌅" label="Rise" time={fmtTime(sun.sunrise)} />
          <SunRow icon="☀️" label="Noon" time={fmtTime(sun.solarNoon)} muted />
          <SunRow icon="🌇" label="Set"  time={fmtTime(sun.sunset)} />
        </div>
        <div style={{
          color: "#7c93ad",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: 1,
          marginTop: "auto"
        }}>
          Daylight {sun.dayLengthHours.toFixed(1)}h
        </div>
      </div>

      {/* MOON column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          color: "#a8c0d8",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <span style={{ fontSize: 14 }}>{moon.emoji}</span>
          <span>Moon Phase</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <span style={{
            fontSize: 46, lineHeight: 1,
            filter: "drop-shadow(0 2px 8px rgba(168,192,216,0.25))"
          }}>{moon.emoji}</span>
          <div>
            <div style={{ fontFamily: "'Bitter', serif", fontSize: 16, color: "#f0f4f8", fontWeight: 600 }}>
              {moon.name}
            </div>
            <div style={{
              color: "#a8c0d8",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11, letterSpacing: 0.5, marginTop: 2
            }}>
              {(moon.illumination * 100).toFixed(0)}% illuminated · {moon.waxing ? "waxing" : "waning"}
            </div>
          </div>
        </div>
        {(moon.illumination > 0.92 || moon.illumination < 0.08) && (
          <div style={{
            color: "#f0c870",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9.5, letterSpacing: 1,
            marginTop: "auto"
          }}>
            ⚡ SOLUNAR PEAK · BONUS NIGHT WINDOW
          </div>
        )}
      </div>

      {/* BITE WINDOWS column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          color: "#5fd28b",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>🎣</span>
            <span>Today's Bite Windows</span>
          </span>
          {activeWindow ? (
            <span style={{
              color: "#5fd28b",
              background: "rgba(95,210,139,0.12)",
              border: "1px solid rgba(95,210,139,0.5)",
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 9, letterSpacing: 1.5,
              animation: "pulseLive 1.6s ease-out infinite"
            }}>● BITE NOW</span>
          ) : upcoming ? (
            <span style={{ color: "#7c93ad", fontSize: 9.5, letterSpacing: 0.5, textTransform: "none" }}>
              Next: {fmtTime(upcoming.start)}
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
          {windows.map(w => {
            const isActive = now >= w.start && now <= w.end;
            const isPast = now > w.end;
            return (
              <div
                key={w.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 10,
                  alignItems: "center",
                  padding: "6px 10px",
                  background: isActive
                    ? "rgba(95,210,139,0.10)"
                    : isPast ? "rgba(255,255,255,0.015)" : "rgba(126,196,207,0.04)",
                  border: isActive
                    ? "1px solid rgba(95,210,139,0.45)"
                    : isPast ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(126,196,207,0.15)",
                  borderRadius: 8,
                  opacity: isPast ? 0.5 : 1
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{w.emoji}</span>
                <div>
                  <div style={{
                    fontFamily: "'Bitter', serif",
                    fontSize: 13.5,
                    color: isActive ? "#7ee5a3" : "#dbe3ec",
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: 1.2
                  }}>{w.name}</div>
                  <div style={{
                    color: "#7c93ad",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10, letterSpacing: 0.5,
                    marginTop: 1
                  }}>
                    {fmtTime(w.start)} – {fmtTime(w.end)} · {fmtDur(w.start, w.end)}
                  </div>
                </div>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10, letterSpacing: 0.5,
                  color: isActive ? "#5fd28b" : "#7c93ad"
                }}>{w.rating}/10</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function SunRow({ icon, label, time, muted }) {
  return (
    <React.Fragment>
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11, letterSpacing: 0.5,
        color: muted ? "#7c93ad" : "#dbe3ec",
        display: "inline-flex", alignItems: "center", gap: 4
      }}>
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span style={{ textTransform: "uppercase", letterSpacing: 1.2, fontSize: 10 }}>{label}</span>
      </span>
      <span style={{
        fontFamily: "'Bitter', serif",
        fontSize: 15, color: muted ? "#a8b8c8" : "#f0f4f8",
        fontWeight: muted ? 400 : 600
      }}>{time}</span>
    </React.Fragment>
  );
}

// ---------- Clickable Species Chip ----------
// Used on Pond cards and Spot cards. Clicking opens the detail modal.
window.SpeciesChip = function SpeciesChip({ name, onClick, rating, compact }) {
  const sp = window.SPECIES.find(s => s.name === name);
  if (!sp) {
    // Unknown species — render plain non-clickable chip
    return (
      <span style={{
        padding: "3px 9px",
        background: "rgba(126,196,207,0.08)",
        border: "1px solid rgba(126,196,207,0.2)",
        borderRadius: 999,
        color: "#a8d1d8",
        fontSize: 11,
        fontFamily: "'Share Tech Mono', monospace"
      }}>{name}</span>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick && onClick(sp); }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: compact ? "2px 8px" : "3px 9px",
        background: `${sp.color}15`,
        border: `1px solid ${sp.color}40`,
        borderRadius: 999,
        color: "#dbe3ec",
        fontSize: compact ? 10.5 : 11,
        fontFamily: "'Share Tech Mono', monospace",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${sp.color}28`;
        e.currentTarget.style.borderColor = `${sp.color}80`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${sp.color}15`;
        e.currentTarget.style.borderColor = `${sp.color}40`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
      title={`Learn about ${name}`}
    >
      <span style={{ fontSize: compact ? 11 : 12 }}>{sp.emoji}</span>
      <span>{name}</span>
      {rating != null && (
        <span style={{ color: sp.color, fontSize: 10, marginLeft: 2 }}>{rating.toFixed(1)}</span>
      )}
    </button>
  );
};

// ---------- Species Detail Modal ----------
// Full-page overlay with everything we know about a fish.
window.SpeciesModal = function SpeciesModal({ species, rating, onClose }) {
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useEffect(() => {
    if (!species) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [species, onClose]);

  if (!species) return null;

  const tier =
    rating == null ? null :
    rating >= 8 ? { label: "HOT", color: "#5fd28b" } :
    rating >= 6 ? { label: "GOOD", color: "#e6b54a" } :
    rating >= 4 ? { label: "FAIR", color: "#e69a4a" } : { label: "SLOW", color: "#d05858" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(2,8,15,0.85)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "40px 16px"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 880,
          width: "100%",
          background: "linear-gradient(180deg, rgba(14,30,54,0.98), rgba(6,14,28,0.98))",
          border: `1px solid ${species.color}55`,
          borderRadius: 18,
          padding: 0,
          boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4)`,
          overflow: "hidden",
          color: "#dbe3ec",
          fontFamily: "'Bitter', serif",
          position: "relative"
        }}
      >
        {/* Hero image — fish takes center stage */}
        <div style={{
          position: "relative",
          height: 320,
          background: species.image && !imgFailed
            ? "#f5f1e8"  // creamy off-white that matches the ID illustrations
            : `linear-gradient(135deg, ${species.color}33, ${species.color}11)`,
          borderBottom: `1px solid ${species.color}40`,
          overflow: "hidden"
        }}>
          {species.image && !imgFailed ? (
            <img
              src={species.image}
              loading="lazy"
              onError={() => setImgFailed(true)}
              alt={species.name}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain", objectPosition: "center",
                padding: "12px 16px"
              }}
            />
          ) : (
            // Placeholder when image fails — large emoji centered
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 140,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
              opacity: 0.7
            }}>{species.emoji}</div>
          )}

          {/* Subtle bottom shadow for chip readability against light background */}
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 80,
            background: species.image && !imgFailed
              ? "linear-gradient(180deg, transparent, rgba(245,241,232,0.0) 30%, rgba(0,0,0,0.0))"
              : "linear-gradient(180deg, transparent, rgba(6,14,28,0.85))",
            pointerEvents: "none"
          }} />

          {/* Top-right close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(6,14,28,0.7)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              color: "#f0f4f8",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11, letterSpacing: 1.5,
              padding: "8px 14px",
              borderRadius: 999,
              cursor: "pointer"
            }}
            title="Close (Esc)"
          >ESC · CLOSE</button>

          {/* Top-left kicker */}
          <div style={{
            position: "absolute", top: 18, left: 22,
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 12px",
            background: "rgba(6,14,28,0.7)",
            border: `1px solid ${species.color}60`,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: 999,
            color: species.color,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 2, textTransform: "uppercase"
          }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>{species.emoji}</span>
            <span>Species Profile</span>
          </div>

          {/* Bottom title block — only when no image (overlay style); otherwise the title moves below the hero */}
          {(!species.image || imgFailed) && (
            <div style={{
              position: "absolute", left: 24, bottom: 18, right: 24,
              display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap"
            }}>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap"
              }}>
                <h2 style={{
                  margin: 0,
                  fontFamily: "'Bitter', serif",
                  fontSize: 40, fontWeight: 700, color: "#f0f4f8", letterSpacing: -0.5,
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)"
                }}>{species.name}</h2>
                {tier && (
                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 11, letterSpacing: 1.5,
                    color: tier.color,
                    border: `1px solid ${tier.color}80`,
                    background: `rgba(6,14,28,0.7)`,
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    padding: "4px 11px",
                    borderRadius: 999
                  }}>{tier.label} · {rating.toFixed(1)}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Title bar below hero — only shown when image is rendered (so it's not buried over the illustration) */}
        {species.image && !imgFailed && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px 26px",
            background: "linear-gradient(180deg, rgba(8,18,34,0.7), rgba(8,18,34,0.3))",
            borderBottom: `1px solid ${species.color}25`,
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{
                margin: 0,
                fontFamily: "'Bitter', serif",
                fontSize: 32, fontWeight: 700, color: "#f0f4f8", letterSpacing: -0.5
              }}>{species.name}</h2>
              {tier && (
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11, letterSpacing: 1.5,
                  color: tier.color,
                  border: `1px solid ${tier.color}80`,
                  background: `${tier.color}18`,
                  padding: "4px 11px",
                  borderRadius: 999
                }}>{tier.label} · {rating.toFixed(1)}</span>
              )}
            </div>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10, letterSpacing: 1.5,
              color: "#7c93ad",
              padding: "3px 8px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.08)"
            }}>📷 ID GUIDE</span>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "24px 26px 28px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Quick facts row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14
          }}>
            <Kv label="PEAK SEASON" value={species.peakSeason} accent={species.color} />
            {species.habitat && <Kv label="HABITAT" value={species.habitat} accent={species.color} />}
          </div>

          {/* Regulations — prominent because it's legal */}
          {species.regulations && <SpeciesRegulations reg={species.regulations} />}

          {/* Behavior */}
          {species.behavior && (
            <SpeciesSection title="Behavior" accent={species.color}>
              {species.behavior}
            </SpeciesSection>
          )}

          {/* Methods */}
          {species.methods && species.methods.length > 0 && (
            <SpeciesSection title="Best Methods" accent={species.color}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {species.methods.map((m, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{m}</li>
                ))}
              </ul>
            </SpeciesSection>
          )}

          {/* Lures + Baits in 2 cols */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18
          }}>
            {species.lures && (
              <SpeciesSection title="Recommended Lures" accent={species.color}>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {species.lures.map((l, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{l}</li>
                  ))}
                </ul>
              </SpeciesSection>
            )}
            {species.baits && (
              <SpeciesSection title="Recommended Baits" accent={species.color}>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {species.baits.map((b, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{b}</li>
                  ))}
                </ul>
              </SpeciesSection>
            )}
          </div>

          {/* Safety to eat */}
          {species.eatSafety && (
            <SpeciesSection title="Safe to Eat?" accent="#e6b54a">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>🍴</span>
                <div>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{species.eatSafety}</p>
                  <a
                    href="https://epa.ohio.gov/divisions-and-offices/surface-water/fact-sheets/Sport-Fish-Consumption-Advisory"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 11, letterSpacing: 1,
                      color: "#7ec4cf",
                      textDecoration: "underline"
                    }}
                  >
                    Ohio EPA Sport Fish Consumption Advisory →
                  </a>
                </div>
              </div>
            </SpeciesSection>
          )}

          {/* Notes */}
          {species.notes && (
            <SpeciesSection title="Local Notes" accent={species.color}>
              <p style={{ margin: 0, fontStyle: "italic", color: "#c0cad8" }}>"{species.notes}"</p>
            </SpeciesSection>
          )}
        </div>
      </div>
    </div>
  );
};

function SpeciesRegulations({ reg }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(230,181,74,0.07), rgba(230,181,74,0.02))",
      border: "1px solid rgba(230,181,74,0.35)",
      borderRadius: 12,
      padding: "14px 16px"
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
        marginBottom: 10,
        paddingBottom: 8,
        borderBottom: "1px dashed rgba(230,181,74,0.3)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          color: "#e6b54a",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 11, letterSpacing: 2, textTransform: "uppercase"
        }}>
          <span style={{ fontSize: 14 }}>⚖️</span>
          <span>Ohio Regulations · 2026-27</span>
        </div>
        <span style={{
          fontFamily: "'Bitter', serif",
          fontSize: 14, fontWeight: 600,
          color: "#f0c870"
        }}>{reg.summary}</span>
      </div>

      {reg.lakeErie && reg.lakeErie.length > 0 && (
        <div style={{ marginBottom: reg.inland ? 12 : 0 }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 1.5,
            color: "#7ec4cf",
            marginBottom: 6, textTransform: "uppercase"
          }}>Lake Erie & Tributaries</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) auto",
            gap: "4px 12px",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11.5
          }}>
            <div style={{ color: "#7c93ad", fontSize: 9, letterSpacing: 1 }}>WINDOW</div>
            <div style={{ color: "#7c93ad", fontSize: 9, letterSpacing: 1 }}>DAILY LIMIT</div>
            <div style={{ color: "#7c93ad", fontSize: 9, letterSpacing: 1 }}>MIN SIZE</div>
            {reg.lakeErie.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ color: "#dbe3ec", paddingTop: 3, paddingBottom: 3, borderTop: i ? "1px dashed rgba(255,255,255,0.06)" : "none" }}>{s.window}</div>
                <div style={{ color: "#dbe3ec", paddingTop: 3, paddingBottom: 3, borderTop: i ? "1px dashed rgba(255,255,255,0.06)" : "none" }}>{s.limit}</div>
                <div style={{ color: "#f0c870", paddingTop: 3, paddingBottom: 3, borderTop: i ? "1px dashed rgba(255,255,255,0.06)" : "none", textAlign: "right" }}>{s.minSize}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {reg.inland && (
        <div style={{ marginBottom: reg.notes ? 12 : 0 }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 1.5,
            color: "#7ec4cf",
            marginBottom: 6, textTransform: "uppercase"
          }}>Statewide / Inland</div>
          <p style={{ margin: 0, fontFamily: "'Bitter', serif", fontSize: 14, lineHeight: 1.55, color: "#dbe3ec" }}>{reg.inland}</p>
        </div>
      )}

      {reg.notes && (
        <p style={{
          margin: 0,
          fontFamily: "'Bitter', serif",
          fontSize: 13, lineHeight: 1.55,
          color: "#c0cad8",
          fontStyle: "italic"
        }}>
          {reg.notes}
        </p>
      )}

      <div style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px dashed rgba(230,181,74,0.3)",
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <a
          href={window.__resources?.ohio_regs_pdf || "docs/Ohio Fishing Regulations 2026-27.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 1.5,
            color: "#e6b54a",
            textDecoration: "none",
            padding: "5px 10px",
            border: "1px solid rgba(230,181,74,0.4)",
            borderRadius: 4
          }}
        >📄 FULL OHIO REGULATIONS PDF</a>
        <a
          href="https://ohiodnr.gov/wps/portal/gov/odnr/rules-and-regulations/recreation-rules/fishing-rules"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 1.5,
            color: "#7ec4cf",
            textDecoration: "none",
            padding: "5px 10px",
            border: "1px solid rgba(126,196,207,0.3)",
            borderRadius: 4
          }}
        >🔗 wildohio.gov →</a>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9, letterSpacing: 1,
          color: "#7c93ad",
          marginLeft: "auto"
        }}>VERIFY BEFORE YOU FISH</span>
      </div>
    </div>
  );
}

function SpeciesSection({ title, accent, children }) {
  return (
    <div>
      <div style={{
        color: accent,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11, letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 8,
        paddingBottom: 6,
        borderBottom: `1px solid ${accent}30`
      }}>{title}</div>
      <div style={{ fontFamily: "'Bitter', serif", fontSize: 14.5, lineHeight: 1.6, color: "#dbe3ec" }}>
        {children}
      </div>
    </div>
  );
}

// ---------- Pond Bite Indicator ----------
// Shown on each pond card. Combines current species ratings + stocking proximity.
window.PondBiteBadge = function PondBiteBadge({ bite }) {
  const colors = {
    HIGH: "#5fd28b",
    GOOD: "#e6b54a",
    FAIR: "#e69a4a",
    SLOW: "#d05858"
  };
  const c = colors[bite.tier] || "#7c93ad";
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: `${c}12`,
      border: `1px solid ${c}50`,
      borderRadius: 10
    }}>
      <span style={{
        position: "relative",
        display: "inline-block", width: 9, height: 9,
        background: c, borderRadius: "50%",
        boxShadow: `0 0 10px ${c}`,
        animation: bite.tier === "HIGH" ? "pulseLive 1.6s ease-out infinite" : "none"
      }} />
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11, letterSpacing: 1.5,
        color: c,
        fontWeight: 600
      }}>{bite.tier} BITE</span>
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10, color: "#7c93ad", letterSpacing: 0.5
      }}>· {bite.score}/10</span>
      {bite.freshStock && (
        <span style={{
          marginLeft: "auto",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: 1,
          color: "#f0c870",
          background: "rgba(230,181,74,0.15)",
          border: "1px solid rgba(230,181,74,0.5)",
          padding: "2px 8px",
          borderRadius: 999
        }}>🐟 FRESH STOCK{bite.daysSinceStock != null ? ` · ${bite.daysSinceStock}d` : ""}</span>
      )}
    </div>
  );
};
