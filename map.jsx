// ============================================================
// Interactive Map — Lake Erie south shore.
// Plots LAKE_SPOTS (circles) and STOCKED_PONDS (squares).
// Marker color encodes current bite rating tier.
// ============================================================

const { useEffect, useRef, useState, useMemo } = React;

// Build a divIcon for a spot or pond, colored by tier.
function buildIcon(tier, kind, rating) {
  const r = Math.round(rating);
  const cls = `rt-marker ${kind === "pond" ? "pond" : "spot"}`;
  const html = `
    <div class="${cls}" style="background:${tier.color};">${r}</div>
  `;
  return window.L.divIcon({
    className: "rt-marker-wrap",
    html,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16]
  });
}

function buildZipIcon() {
  return window.L.divIcon({
    className: "rt-marker-wrap",
    html: `<div class="rt-marker-zip"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10]
  });
}

function buildBuoyIcon(isActive) {
  return window.L.divIcon({
    className: "rt-marker-wrap",
    html: `<div class="rt-marker-buoy ${isActive ? "active" : ""}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12]
  });
}

// Escape user-displayed strings going into popup HTML.
function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build the inner HTML for a popup. Species names are tagged with
// data-species so the click handler (delegated below) can open the modal.
function buildSpotPopup(spot, tier) {
  const rating = Math.round(spot.rating * 10) / 10;
  const species = (spot.species || [])
    .map(name => `<span class="rt-popup-chip" data-species="${esc(name)}">${esc(name)}</span>`)
    .join("");
  const distance = spot.distance != null
    ? `<span style="color:#7ec4cf"> · ${spot.distance.toFixed(1)} mi</span>`
    : "";
  return `
    <div class="rt-popup-kicker">${esc(spot.type || "Lake Spot")} · ${esc(spot.city || "")}${distance}</div>
    <div class="rt-popup-title">${esc(spot.name)}</div>
    <div class="rt-popup-rating" style="background:${tier.bg};color:${tier.color};border:1px solid ${tier.border}">
      ${tier.label} · ${rating}/10
    </div>
    <div class="rt-popup-desc">${esc(spot.description || "")}</div>
    <div class="rt-popup-chips">${species}</div>
  `;
}

function buildPondPopup(pond, tier) {
  const score = Math.round((pond.bite?.score ?? 5) * 10) / 10;
  const species = (pond.species || [])
    .map(name => `<span class="rt-popup-chip" data-species="${esc(name)}">${esc(name)}</span>`)
    .join("");
  const distance = pond.distance != null
    ? `<span style="color:#7ec4cf"> · ${pond.distance.toFixed(1)} mi</span>`
    : "";
  const fresh = pond.bite?.freshStock
    ? `<div style="color:#3fb564;font-family:'Share Tech Mono',monospace;font-size:10.5px;letter-spacing:1px;margin-top:6px">★ FRESHLY STOCKED</div>`
    : "";
  const stockingDate = pond.stockingDate2026
    ? `<div style="color:#a8b8c8;font-family:'Share Tech Mono',monospace;font-size:10.5px;margin-top:4px">Stocked ${esc(pond.stockingDate2026)}</div>`
    : "";
  return `
    <div class="rt-popup-kicker">Stocked Pond · ${esc(pond.city || "")}${distance}</div>
    <div class="rt-popup-title">${esc(pond.name)}</div>
    <div class="rt-popup-rating" style="background:${tier.bg};color:${tier.color};border:1px solid ${tier.border}">
      ${tier.label} · ${score}/10
    </div>
    <div class="rt-popup-desc">${esc(pond.park || "")}</div>
    ${fresh}
    ${stockingDate}
    <div class="rt-popup-chips">${species}</div>
  `;
}

// Buoy popup. If this is the currently-selected buoy and we have live data,
// show the readings; otherwise show static metadata + a hint.
function buildBuoyPopup(buoyMeta, isActive, liveBuoy, onSelectHTML) {
  const live = isActive && liveBuoy && !liveBuoy.seasonal;
  const readings = live ? `
    <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 10px;margin-top:8px;font-family:'Share Tech Mono',monospace;font-size:11.5px">
      ${liveBuoy.airF   != null ? `<span style="color:#7c93ad">AIR</span><span style="color:#dbe3ec">${liveBuoy.airF}°F</span>` : ""}
      ${liveBuoy.waterF != null ? `<span style="color:#7c93ad">WATER</span><span style="color:#dbe3ec">${liveBuoy.waterF}°F</span>` : ""}
      ${liveBuoy.windDir != null ? `<span style="color:#7c93ad">WIND</span><span style="color:#dbe3ec">${esc(liveBuoy.windDir)} ${liveBuoy.windMph ?? ""} mph</span>` : ""}
      ${liveBuoy.gustMph != null ? `<span style="color:#7c93ad">GUST</span><span style="color:#dbe3ec">${liveBuoy.gustMph} mph</span>` : ""}
      ${liveBuoy.waveFt  != null ? `<span style="color:#7c93ad">WAVES</span><span style="color:#dbe3ec">${liveBuoy.waveFt} ft</span>` : ""}
    </div>
  ` : "";
  const liveTag = live
    ? `<span style="color:#3fb564">● LIVE</span>`
    : (isActive ? `<span style="color:#e6b54a">○ SEASONAL EST.</span>` : "");
  const selectBtn = isActive
    ? `<div style="color:#7ec4cf;font-family:'Share Tech Mono',monospace;font-size:10.5px;letter-spacing:1px;margin-top:8px">★ ACTIVE BUOY</div>`
    : `<button type="button" class="rt-popup-chip" data-buoy="${esc(buoyMeta.id)}" style="margin-top:8px;cursor:pointer">Use this buoy →</button>`;
  return `
    <div class="rt-popup-kicker">${esc(buoyMeta.group || "Buoy")} · ${esc(buoyMeta.id)}</div>
    <div class="rt-popup-title">${esc(buoyMeta.name)}</div>
    <div style="font-family:'Share Tech Mono',monospace;font-size:10.5px;letter-spacing:1px">${liveTag}</div>
    ${readings}
    ${selectBtn}
  `;
}

// ------------------------------------------------------------
// MapCard — main exported component
// ------------------------------------------------------------
window.MapCard = function MapCard({
  spots, ponds, zipLoc, station, onSpeciesClick, vp, speciesFilter,
  buoys, buoyId, buoy, onBuoyChange
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({ spots: null, ponds: null, zip: null, buoys: null });
  const [show, setShow] = useState({ spots: true, ponds: true, buoys: true });
  const [didFit, setDidFit] = useState(false);

  // ---------- Initialize map once ----------
  useEffect(() => {
    if (!window.L || !containerRef.current || mapRef.current) return;

    const map = window.L.map(containerRef.current, {
      center: [41.55, -82.0],
      zoom: 9,
      minZoom: 6,
      maxZoom: 17,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // CartoDB Dark Matter tiles — matches dashboard aesthetic.
    window.L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> · © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }
    ).addTo(map);

    mapRef.current = map;

    // Delegated click handler for species chips inside popups.
    map.on("popupopen", (e) => {
      const root = e.popup.getElement();
      if (!root) return;
      root.querySelectorAll("[data-species]").forEach(el => {
        el.addEventListener("click", () => {
          const name = el.getAttribute("data-species");
          const species = window.SPECIES.find(s => s.name === name);
          if (species && onSpeciesClick) onSpeciesClick(species);
        });
      });
      root.querySelectorAll("[data-buoy]").forEach(el => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-buoy");
          if (id && onBuoyChange) onBuoyChange(id);
          map.closePopup();
        });
      });
    });

    // Resize handler: Leaflet needs invalidateSize when container appears.
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---------- Render markers when data changes ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous layers.
    if (layersRef.current.spots) map.removeLayer(layersRef.current.spots);
    if (layersRef.current.ponds) map.removeLayer(layersRef.current.ponds);
    if (layersRef.current.buoys) map.removeLayer(layersRef.current.buoys);

    const spotLayer  = window.L.layerGroup();
    const pondLayer  = window.L.layerGroup();
    const buoyLayer  = window.L.layerGroup();

    if (show.spots) {
      spots.forEach(s => {
        const tier = window.tierFor(s.rating);
        const marker = window.L.marker([s.lat, s.lng], {
          icon: buildIcon(tier, "spot", s.rating),
          title: s.name,
          riseOnHover: true
        });
        marker.bindPopup(buildSpotPopup(s, tier), {
          maxWidth: 280,
          closeButton: true,
          autoPan: true
        });
        spotLayer.addLayer(marker);
      });
    }

    if (show.ponds) {
      ponds.forEach(p => {
        const score = p.bite?.score ?? 5;
        const tier = window.tierFor(score);
        const marker = window.L.marker([p.lat, p.lng], {
          icon: buildIcon(tier, "pond", score),
          title: p.name,
          riseOnHover: true
        });
        marker.bindPopup(buildPondPopup(p, tier), {
          maxWidth: 280,
          closeButton: true,
          autoPan: true
        });
        pondLayer.addLayer(marker);
      });
    }

    spotLayer.addTo(map);
    pondLayer.addTo(map);

    if (show.buoys && Array.isArray(buoys)) {
      buoys.forEach(b => {
        const isActive = b.id === buoyId;
        const marker = window.L.marker([b.lat, b.lng], {
          icon: buildBuoyIcon(isActive),
          title: `${b.id} — ${b.name}`,
          riseOnHover: true,
          zIndexOffset: isActive ? 500 : 0
        });
        marker.bindPopup(buildBuoyPopup(b, isActive, buoy), {
          maxWidth: 280, autoPan: true
        });
        buoyLayer.addLayer(marker);
      });
    }
    buoyLayer.addTo(map);

    layersRef.current.spots = spotLayer;
    layersRef.current.ponds = pondLayer;
    layersRef.current.buoys = buoyLayer;

    // Fit bounds the first time we have data.
    if (!didFit && (spots.length || ponds.length)) {
      const all = [
        ...(show.spots ? spots : []).map(s => [s.lat, s.lng]),
        ...(show.ponds ? ponds : []).map(p => [p.lat, p.lng])
      ];
      if (all.length) {
        const bounds = window.L.latLngBounds(all);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
        setDidFit(true);
      }
    }
  }, [spots, ponds, show.spots, show.ponds, show.buoys, buoys, buoyId, buoy]);

  // ---------- Zip pin ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layersRef.current.zip) {
      map.removeLayer(layersRef.current.zip);
      layersRef.current.zip = null;
    }
    if (zipLoc) {
      const m = window.L.marker([zipLoc.lat, zipLoc.lng], {
        icon: buildZipIcon(),
        zIndexOffset: 1000,
        title: `${zipLoc.city}, ${zipLoc.state}`
      });
      m.bindPopup(`
        <div class="rt-popup-kicker">Your Location</div>
        <div class="rt-popup-title">${esc(zipLoc.city)}, ${esc(zipLoc.state)}</div>
        <div class="rt-popup-meta">ZIP ${esc(zipLoc.zip)}</div>
      `);
      m.addTo(map);
      layersRef.current.zip = m;
    }
  }, [zipLoc]);

  // ---------- Recenter on zip when set ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !zipLoc) return;
    map.setView([zipLoc.lat, zipLoc.lng], Math.max(map.getZoom(), 10), { animate: true });
  }, [zipLoc?.zip]);

  // ---------- Counts ----------
  const spotCount = spots.length;
  const pondCount = ponds.length;
  const buoyCount = (buoys || []).length;

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(14,28,50,0.85), rgba(8,18,34,0.85))",
      border: "1px solid rgba(126,196,207,0.18)",
      borderRadius: 14,
      padding: 16,
      marginBottom: 16
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12
      }}>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "#7ec4cf",
            fontSize: 10.5,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 2
          }}>
            South Shore · Interactive Map
          </div>
          <div style={{
            fontFamily: "'Bitter', serif",
            color: "#dbe3ec",
            fontSize: 13,
            fontStyle: "italic"
          }}>
            Tap a marker for ratings, species, and access notes.
            {speciesFilter ? <span style={{ color: "#e6b54a" }}> Filtered: {speciesFilter}.</span> : null}
          </div>
        </div>
        <div className="rt-map-toggles">
          <button
            type="button"
            className={`rt-map-toggle ${show.spots ? "active" : ""}`}
            onClick={() => setShow(s => ({ ...s, spots: !s.spots }))}
            aria-pressed={show.spots}
          >
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: "50%",
              background: "#7ec4cf", marginRight: 6, verticalAlign: 1
            }} />
            Lake Spots · {spotCount}
          </button>
          <button
            type="button"
            className={`rt-map-toggle ${show.ponds ? "active" : ""}`}
            onClick={() => setShow(s => ({ ...s, ponds: !s.ponds }))}
            aria-pressed={show.ponds}
          >
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: 2,
              background: "#e6b54a", marginRight: 6, verticalAlign: 1
            }} />
            Ponds · {pondCount}
          </button>
          <button
            type="button"
            className={`rt-map-toggle ${show.buoys ? "active" : ""}`}
            onClick={() => setShow(s => ({ ...s, buoys: !s.buoys }))}
            aria-pressed={show.buoys}
          >
            <span style={{
              display: "inline-block", width: 9, height: 9, transform: "rotate(45deg)",
              background: "transparent", border: "1.5px solid #7ec4cf",
              marginRight: 8, verticalAlign: 1
            }} />
            Buoys · {buoyCount}
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div ref={containerRef} className="rt-map" />
        <div className="rt-legend" aria-hidden="true">
          <div className="rt-legend-header">Bite Rating</div>
          {window.RATING_TIERS.map(t => (
            <div className="rt-legend-row" key={t.label}>
              <span className="rt-legend-dot" style={{ background: t.color }} />
              <span style={{ color: t.color }}>{t.label}</span>
              <span style={{ color: "#7c93ad", marginLeft: "auto" }}>
                {t.min}+
              </span>
            </div>
          ))}
          <div style={{
            borderTop: "1px dashed rgba(126,196,207,0.2)",
            margin: "7px 0 5px"
          }} />
          <div className="rt-legend-row">
            <span className="rt-legend-dot" style={{ background: "#7c93ad" }} />
            <span style={{ color: "#a8b8c8" }}>Lake</span>
          </div>
          <div className="rt-legend-row">
            <span className="rt-legend-sq" style={{ background: "#7c93ad" }} />
            <span style={{ color: "#a8b8c8" }}>Pond</span>
          </div>
          <div className="rt-legend-row">
            <span style={{
              width: 12, height: 12, transform: "rotate(45deg)",
              background: "transparent", border: "1.5px solid #7ec4cf",
              display: "inline-block"
            }} />
            <span style={{ color: "#a8b8c8" }}>Buoy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
