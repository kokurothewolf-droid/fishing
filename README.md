# Reef & Tide — Lake Erie Fishing Dashboard

A single-page fishing forecast for the Lake Erie southern shoreline (Sandusky → Cleveland) and Ohio inland stocked ponds. Built as a React-in-Babel artifact — no build step required, just open the HTML.

## Features

- **Live data** — NOAA NDBC buoy readings (water temp, wave height, wind) with a CORS-proxy fallback chain, and live weather via Open-Meteo.
- **Today's Game Plan** — A friendly paragraph recommending what to fish for, where, and with what tactics. Modes: Shore / Boat / Pond / Both.
- **13 Lake Erie spots** from Sandusky to Cleveland — piers, marinas, harbors, river mouths.
- **29 stocked ponds** including the entire ODNR District 3 trout-stocking schedule for 2026.
- **13 species profiles** with annotated ID illustrations, behavior, methods, lures, baits, eat-safety guidance, and full Ohio 2026-27 regulations (seasonal limits + min sizes).
- **Pond bite indicator** — per-pond scoring that boosts within 14 days of stocking, with a "FRESH STOCK" badge.
- **Sun / Moon / Bite Windows** — daily sunrise/sunset, moon phase, and prime fishing windows from a pure-JS solar/lunar calculator.
- **Zip-code distance sorting** via Zippopotam.us.

## Files

```
Reef and Tide.html              Main entry point — open in any browser
app.jsx                          Top-level App + tab routing
components.jsx                   All React components (cards, modal, widgets)
intelligence.js                  Buoy fetch, ratings, game-plan generator
astro.js                         Sun/moon/bite-window math (no API needed)
data.js                          Spots, ponds, species, buoys, seasonal data
images/species/                  ODNR-style annotated fish illustrations
docs/                            Ohio Fishing Regulations 2026-27 PDF

Reef and Tide - Offline Standalone.html   Self-contained single-file build
```

## Run it

Just open `Reef and Tide.html` in a browser. No build step, no install. It uses React 18 + Babel from CDNs.

For a fully offline single-file version, use `Reef and Tide - Offline Standalone.html` — everything is inlined.

## Stack

- React 18 (UMD) + Babel Standalone (in-browser JSX)
- Bitter + Share Tech Mono via Google Fonts
- NOAA NDBC, Open-Meteo, Zippopotam.us — all keyless public APIs

## Data sources

- **Fish illustrations** — ODNR-style identification guide
- **Trout stocking schedule** — [ODNR 2026 Rainbow Trout Stockings](https://ohiodnr.gov/buy-and-apply/hunting-fishing-boating/fishing-resources/trout-stockings)
- **Regulations** — Ohio Fishing Regulations 2026-27 (PDF included in `docs/`)
- **Live buoys** — [NDBC](https://www.ndbc.noaa.gov)
- **Live weather** — [Open-Meteo](https://open-meteo.com)
