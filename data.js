// ============================================================
// Lake Erie Fishing Dashboard — Data Layer
// All static reference data. No fabricated pond names.
// ============================================================

// ---------- LAKE ERIE PUBLIC FISHING SPOTS ----------
// Sandusky → Cleveland, southern shoreline
window.LAKE_SPOTS = [
  {
    id: "battery-park",
    name: "Battery Park Marina",
    city: "Sandusky",
    type: "Marina",
    lat: 41.4622, lng: -82.7080,
    baseRating: 7,
    description: "Protected bay water, walleye and perch from the wall and adjacent piers. Light tackle friendly.",
    access: "Free public access. Parking at marina lot.",
    species: ["Walleye", "Yellow Perch", "Smallmouth Bass", "White Bass"]
  },
  {
    id: "marblehead",
    name: "Marblehead Lighthouse",
    city: "Marblehead",
    type: "Shoreline Rocks",
    lat: 41.5370, lng: -82.7110,
    baseRating: 8,
    description: "Rocky points off the historic lighthouse. Smallmouth bass cruise the breakwall — classic spring/fall spot.",
    access: "State park, parking fee in season.",
    species: ["Smallmouth Bass", "Walleye", "Yellow Perch", "White Bass"]
  },
  {
    id: "east-harbor",
    name: "East Harbor State Park",
    city: "Lakeside-Marblehead",
    type: "State Park",
    lat: 41.5466, lng: -82.8157,
    baseRating: 7,
    description: "Shore access, fishing pier, and protected harbor. Mixed bag of pond and lake fish.",
    access: "Free park entry. Pier on harbor side.",
    species: ["Largemouth Bass", "Bluegill", "Yellow Perch", "Channel Catfish", "Carp"]
  },
  {
    id: "catawba",
    name: "Catawba Island State Park",
    city: "Port Clinton",
    type: "Shoreline / Pier",
    lat: 41.5760, lng: -82.8590,
    baseRating: 7,
    description: "Riprap shoreline and small pier. Walleye troll within easy boat reach; shore casting for smallies.",
    access: "Free. Boat ramp $$.",
    species: ["Walleye", "Smallmouth Bass", "White Bass", "Yellow Perch"]
  },
  {
    id: "port-clinton-pier",
    name: "Port Clinton City Pier",
    city: "Port Clinton",
    type: "Pier",
    lat: 41.5125, lng: -82.9377,
    baseRating: 8,
    description: "Long concrete pier at the Portage River mouth. Walleye run thick in spring, perch in fall.",
    access: "Free, downtown parking.",
    species: ["Walleye", "Yellow Perch", "White Bass", "Channel Catfish"]
  },
  {
    id: "huron-pier",
    name: "Huron Pier",
    city: "Huron",
    type: "Pier",
    lat: 41.3961, lng: -82.5475,
    baseRating: 7,
    description: "Long pier protecting the Huron River mouth. Steelhead in shoulder seasons.",
    access: "Free public access.",
    species: ["Steelhead", "Walleye", "Yellow Perch", "White Bass", "Smallmouth Bass"]
  },
  {
    id: "vermilion-mouth",
    name: "Vermilion River Mouth",
    city: "Vermilion",
    type: "River Mouth",
    lat: 41.4234, lng: -82.3640,
    baseRating: 6,
    description: "Sherod Park and adjacent shoreline. Steelhead drop down in fall; perch off the breakwall.",
    access: "Sherod Park free parking.",
    species: ["Steelhead", "Yellow Perch", "Smallmouth Bass", "White Bass"]
  },
  {
    id: "lorain-harbor",
    name: "Lorain Harbor / Hot Waters",
    city: "Lorain",
    type: "Harbor / Pier",
    lat: 41.4810, lng: -82.1840,
    baseRating: 8,
    description: "Power plant warm-water discharge and lighthouse breakwall. Year-round action; bluebacks in winter.",
    access: "Free shore access at Lakeview Park & Hot Waters lot.",
    species: ["Walleye", "Yellow Perch", "Steelhead", "White Bass", "Smallmouth Bass"]
  },
  {
    id: "miller-rd",
    name: "Miller Road Park Pier",
    city: "Avon Lake",
    type: "Pier",
    lat: 41.5210, lng: -82.0250,
    baseRating: 7,
    description: "City pier with night lights. Walleye casters work the lights after dark; perch by day.",
    access: "Free city park. Pier open 24h.",
    species: ["Walleye", "Yellow Perch", "Smallmouth Bass", "White Perch", "White Bass"]
  },
  {
    id: "rocky-river",
    name: "Rocky River Reservation",
    city: "Rocky River",
    type: "River",
    lat: 41.4720, lng: -81.8520,
    baseRating: 7,
    description: "Lower Rocky River — premier Ohio steelhead tributary October through April. Float jigs & spawn.",
    access: "Cleveland Metroparks, free.",
    species: ["Steelhead", "Smallmouth Bass", "Rock Bass", "Channel Catfish"]
  },
  {
    id: "edgewater",
    name: "Edgewater Park",
    city: "Cleveland",
    type: "Pier / Beach",
    lat: 41.4900, lng: -81.7430,
    baseRating: 7,
    description: "Long fishing pier west of downtown Cleveland. Sheephead, perch, and walleye after dark.",
    access: "Cleveland Metroparks, free parking.",
    species: ["Yellow Perch", "Walleye", "White Perch", "Smallmouth Bass", "Channel Catfish"]
  },
  {
    id: "black-river",
    name: "Black River Reservation",
    city: "Lorain",
    type: "River",
    lat: 41.4350, lng: -82.1430,
    baseRating: 7,
    description: "Lower Black River — strong steelhead tributary October through April. Days Dam, Steel Mill Trailhead, and the Bridgeway Trail offer multiple access points along the gorge.",
    access: "Lorain County Metro Parks, free. Paved trail + multiple shore-fishing points.",
    species: ["Steelhead", "Smallmouth Bass", "Rock Bass", "Channel Catfish", "Largemouth Bass", "White Bass", "Bluegill"]
  },
  {
    id: "french-creek",
    name: "French Creek Reservation",
    city: "Sheffield Village",
    type: "River",
    lat: 41.4791, lng: -82.0883,
    baseRating: 6,
    description: "Tributary of the Black River cutting through Sheffield Village. Spring steelhead push up during the run; warmwater fishing for bass, sunfish, and rock bass in summer.",
    access: "Lorain County Metro Parks, free. Trailheads off Colorado Ave and Detroit Rd.",
    species: ["Steelhead", "Smallmouth Bass", "Rock Bass", "Bluegill", "Largemouth Bass", "Channel Catfish"]
  }
];

// ---------- VERIFIED STOCKED PONDS ----------
// Only ODNR / Cleveland Metroparks / Lorain County / Erie MetroParks
// publicly-listed waters. No invented small-city ponds.
window.STOCKED_PONDS = [
  {
    id: "wallace",
    name: "Wallace Lake",
    park: "Cleveland Metroparks — Mill Stream Run",
    city: "Berea",
    lat: 41.3590, lng: -81.8830,
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR spring rainbow trout release",
    notes: "Swimming beach + fishing area. Trout stocked annually in spring; warmwater year-round."
  },
  {
    id: "ranger",
    name: "Ranger Lake",
    park: "Cleveland Metroparks — South Chagrin",
    city: "Bentleyville",
    lat: 41.4150, lng: -81.4300,
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
    stocking: "ODNR spring rainbow trout release",
    notes: "Small reservation lake. Trout stocked spring."
  },
  {
    id: "ledge",
    name: "Ledge Lake",
    park: "Cleveland Metroparks — Hinckley Reservation",
    city: "Hinckley",
    lat: 41.2280, lng: -81.7280,
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
    stocking: "ODNR spring rainbow trout release",
    notes: "Small clear lake near Hinckley quarry. Spring trout."
  },
  {
    id: "hinckley",
    name: "Hinckley Lake",
    park: "Cleveland Metroparks — Hinckley Reservation",
    city: "Hinckley",
    lat: 41.2210, lng: -81.7330,
    species: ["Largemouth Bass", "Bluegill", "Channel Catfish", "Carp", "Yellow Perch"],
    stocking: "Self-sustaining warmwater fishery",
    notes: "Largest Metroparks lake. Boat rental on-site. No trout."
  },
  {
    id: "findley",
    name: "Findley Lake",
    park: "Findley State Park",
    city: "Wellington",
    lat: 41.1330, lng: -82.2160,
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR spring rainbow trout release",
    notes: "93-acre state park lake. Trout in spring; bass & panfish summer."
  },
  {
    id: "wellington",
    name: "Wellington Reservoir",
    park: "Wellington Reservation (Lorain County Metro Parks)",
    city: "Wellington",
    lat: 41.1620, lng: -82.2350,
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR spring rainbow trout release",
    notes: "Two reservoirs. Spring trout stocking; warmwater rest of year."
  },
  {
    id: "punderson",
    name: "Punderson Lake",
    park: "Punderson State Park",
    city: "Newbury",
    lat: 41.4570, lng: -81.2350,
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Yellow Perch", "Channel Catfish"],
    stocking: "ODNR fall & winter rainbow trout release",
    notes: "Deep glacial kettle lake. Ice fishing for trout in winter."
  },
  {
    id: "schoepfle",
    name: "Schoepfle Garden Pond",
    park: "Lorain County Metro Parks",
    city: "Birmingham",
    lat: 41.3920, lng: -82.3920,
    species: ["Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "Warmwater — Lorain CMP managed",
    notes: "Catch-and-release oriented. Check park rules."
  },
  {
    id: "east-branch",
    name: "East Branch Reservoir",
    park: "Geauga Park District",
    city: "Burton",
    lat: 41.4660, lng: -81.1290,
    species: ["Largemouth Bass", "Bluegill", "Yellow Perch", "Channel Catfish", "Crappie"],
    stocking: "Self-sustaining warmwater",
    notes: "Cleveland water supply reservoir. Electric motors only."
  },

  // ---- District 3 — ODNR 2026 Rainbow Trout Stocking ----
  // Sourced from ohiodnr.gov/buy-and-apply/hunting-fishing-boating/fishing-resources/trout-stockings
  {
    id: "boettler",
    name: "Boettler Park Pond",
    park: "City of Green",
    city: "Green",
    lat: 41.0085, lng: -81.4665,
    district: 3, stockingDate2026: "03/26/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/26/2026)",
    notes: "City park pond. Take exit 118 off I-77, south on Massillon Rd (OH-241)."
  },
  {
    id: "monument-park",
    name: "Monument Park Pond",
    park: "City of Canton",
    city: "Canton",
    lat: 40.8090, lng: -81.3870,
    district: 3, stockingDate2026: "03/26/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/26/2026)",
    notes: "Adjacent to McKinley National Memorial. <1 mi south of Stadium Park Pond."
  },
  {
    id: "stadium-park",
    name: "Stadium Park Pond",
    park: "City of Canton",
    city: "Canton",
    lat: 40.8140, lng: -81.3950,
    district: 3, stockingDate2026: "03/26/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/26/2026)",
    notes: "Adjacent to McKinley Memorial. Exit 107A (Fulton Rd) off I-77."
  },
  {
    id: "jefferson-lake",
    name: "Jefferson Lake",
    park: "Jefferson Lake State Park",
    city: "Wintersville",
    lat: 40.4555, lng: -80.7820,
    district: 3, stockingDate2026: "03/27/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish", "Crappie"],
    stocking: "ODNR District 3 · spring rainbow trout (03/27/2026)",
    notes: "Open 24 hrs to all ages. SR-43 north from Richmond, right on CR-54."
  },
  {
    id: "petros-lake",
    name: "Petros Lake",
    park: "Stark Parks",
    city: "Canton",
    lat: 40.7715, lng: -81.4080,
    district: 3, stockingDate2026: "03/27/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/27/2026)",
    notes: "Sunrise to sunset, all ages. Corner of Perry Dr SW and Faircrest St SW."
  },
  {
    id: "forest-hill",
    name: "Forest Hill Pond",
    park: "Forest Hill Park",
    city: "East Cleveland",
    lat: 41.5095, lng: -81.5750,
    district: 3, stockingDate2026: "03/30/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/30/2026)",
    notes: "South of Euclid Ave, north of Mayfield Rd. Off Lee Rd in Cleveland Heights."
  },
  {
    id: "shadow-lake",
    name: "Shadow Lake",
    park: "Solon City Park",
    city: "Solon",
    lat: 41.3825, lng: -81.4275,
    district: 3, stockingDate2026: "03/30/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/30/2026)",
    notes: "Open 6 AM–11 PM, all ages. Off Hawthorn Pkwy south of Solon Rd."
  },
  {
    id: "westlake-rec",
    name: "Westlake Recreation Center Pond",
    park: "City of Westlake",
    city: "Westlake",
    lat: 41.4490, lng: -81.9215,
    district: 3, stockingDate2026: "03/30/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/30/2026)",
    notes: "Off Hilliard Blvd. Close to Avon Lake / Bay Village anglers."
  },
  {
    id: "rowland",
    name: "Rowland Nature Preserve Lake",
    park: "Western Reserve Land Conservancy",
    city: "Elyria",
    lat: 41.4030, lng: -82.1290,
    district: 3, stockingDate2026: "03/31/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/31/2026)",
    notes: "Sunrise to sunset. Carry-in electric craft OK; no boat ramp. Off Murray Ridge Rd."
  },
  {
    id: "veterans-mentor",
    name: "Veteran's Park (Granger Pond)",
    park: "City of Mentor",
    city: "Mentor",
    lat: 41.6700, lng: -81.3450,
    district: 3, stockingDate2026: "03/31/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (03/31/2026)",
    notes: "Open 6 AM–11 PM, all ages. SR-615 (Center St) north of SR-2."
  },
  {
    id: "beartown",
    name: "Beartown Lake (Lower)",
    park: "Geauga Park District — Beartown Lakes Reservation",
    city: "Bainbridge Township",
    lat: 41.4150, lng: -81.3855,
    district: 3, stockingDate2026: "04/01/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
    stocking: "ODNR District 3 · spring rainbow trout (04/01/2026)",
    notes: "Park hours 6 AM–11 PM. Off Taylor May Rd south of Chagrin Falls."
  },
  {
    id: "blue-heron",
    name: "Blue Heron Preserve Pond",
    park: "Western Reserve Land Conservancy",
    city: "Burton",
    lat: 41.4530, lng: -81.1605,
    district: 3, stockingDate2026: "04/01/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
    stocking: "ODNR District 3 · spring rainbow trout (04/01/2026)",
    notes: "Off SR-44 in Burton, just north of Punderson Lake."
  },
  {
    id: "east-palestine",
    name: "East Palestine Park Pond",
    park: "Village of East Palestine",
    city: "East Palestine",
    lat: 40.8275, lng: -80.5380,
    district: 3, stockingDate2026: "04/02/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (04/02/2026)",
    notes: "Off W Main Street. Far southeast corner of District 3."
  },
  {
    id: "wingfoot-wa",
    name: "Wingfoot Wildlife Area Pond",
    park: "Wingfoot Lake State Park (WA Pond)",
    city: "Mogadore",
    lat: 41.0220, lng: -81.3270,
    district: 3, stockingDate2026: "04/02/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
    stocking: "ODNR District 3 · spring rainbow trout (04/02/2026)",
    notes: "Small pond inside the wildlife area. Off US-224 near Mogadore."
  },
  {
    id: "al-lease",
    name: "Al Lease Park Pond",
    park: "City of Kent",
    city: "Kent",
    lat: 41.1700, lng: -81.3800,
    district: 3, stockingDate2026: "04/17/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill"],
    stocking: "ODNR District 3 · spring rainbow trout (04/17/2026)",
    notes: "Off Silver Meadows Blvd. I-76 exit 33 (OH-43)."
  },
  {
    id: "kiwanis-painesville",
    name: "Kiwanis Recreation Park Pond",
    park: "City of Painesville",
    city: "Painesville",
    lat: 41.7470, lng: -81.2470,
    district: 3, stockingDate2026: "04/17/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (04/17/2026)",
    notes: "Off Latimore St. I-90 exit 200 to OH-44 north."
  },
  {
    id: "lock-4",
    name: "Ohio Canal Lock #4",
    park: "St. Helena Heritage Park",
    city: "Canal Fulton",
    lat: 40.8855, lng: -81.5980,
    district: 3, stockingDate2026: "04/25/2026",
    species: ["Rainbow Trout", "Channel Catfish", "Carp", "Bluegill"],
    stocking: "ODNR District 3 · spring rainbow trout (04/25/2026)",
    notes: "Canal section southeast of Cherry St bridge. Sunrise to sunset; trout derby last Sat in April."
  },
  {
    id: "tuscora",
    name: "Tuscora Park Pond",
    park: "City of New Philadelphia",
    city: "New Philadelphia",
    lat: 40.4885, lng: -81.4495,
    district: 3, stockingDate2026: "05/02/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (05/02/2026) — NEW for 2026",
    notes: "Parking off Tuscora Ave NW. I-77 exit 81 (US-250)."
  },
  {
    id: "walker-rd",
    name: "Walker Road Pond",
    park: "Walker Road Park (Avon Lake / Bay Village)",
    city: "Avon Lake",
    lat: 41.4945, lng: -81.9420,
    district: 3, stockingDate2026: "05/02/2026",
    species: ["Rainbow Trout", "Largemouth Bass", "Bluegill", "Channel Catfish"],
    stocking: "ODNR District 3 · spring rainbow trout (05/02/2026) — NEW for 2026",
    notes: "Off Walker Rd west of Bradley. Closest trout pond to Avon Lake."
  },
  {
    id: "oh-erie-canal",
    name: "Ohio / Erie Canal (Canal Way)",
    park: "Cleveland Metroparks — Ohio & Erie Canal Reservation",
    city: "Cleveland",
    lat: 41.4470, lng: -81.6505,
    district: 3, stockingDate2026: "05/16/2026",
    species: ["Rainbow Trout", "Channel Catfish", "Carp", "Bluegill"],
    stocking: "ODNR District 3 · spring rainbow trout (05/16/2026)",
    notes: "Canal Way Visitor's Center off E 49th St. Closed May 17–19 for Children's Derby."
  }
];

// ---------- SPECIES ----------
window.SPECIES = [
  {
    name: "Walleye",
    emoji: "🐟",
    color: "#d4a657",
    peakSeason: "Mar–May, Oct–Dec",
    methods: ["Trolling crankbaits", "Casting jigs", "Drifting worm harnesses"],
    baits: ["Nightcrawlers (worm harness)", "Emerald shiners", "Live minnows"],
    lures: ["Rapala Shad Rap (#5–7)", "Reef Runner Deep Diver", "Erie Dearie / Mack's Smile Blade harness", "1/4–3/8 oz jig + twister"],
    image: window.__resources?.walleye_img || "images/species/walleye.png",
    notes: "Low-light feeder. Dawn, dusk, and after dark are prime. Lake Erie has the world's best walleye fishing.",
    behavior: "Schooling apex predator that follows baitfish along reefs, mud-rock transitions, and current breaks. Low-light feeder with reflective tapetum lucidum — feeds heavily at dawn, dusk, and after dark; suspends during bright midday in deeper, darker water.",
    habitat: "Western basin reefs in spring; scatters east into 30–60 ft of the central basin by mid-summer.",
    eatSafety: "Excellent eating — firm white fillets. Lake Erie advisories suggest moderation (Ohio EPA recommends roughly 1 meal/week of Lake Erie walleye for the general population; less for sensitive groups). Always check current Ohio Sport Fish Consumption Advisory.",
    regulations: {"summary":"6/day · 15-inch minimum (Lake Erie)","lakeErie":[{"window":"Mar 1 – Apr 30, 2026","limit":"6 (Walleye/Saugeye/Sauger combined)","minSize":"15 in"},{"window":"May 1, 2026 – Feb 28, 2027","limit":"TBA late April (typically 6)","minSize":"15 in"}],"inland":"6/day combined, no min size statewide.","notes":"Lake Erie open year-round. The May-onward limit is set in late April based on stock assessments — check wildohio.gov before your trip."}
  },
  {
    name: "Yellow Perch",
    emoji: "🐠",
    color: "#e6c34a",
    peakSeason: "Sep–Nov",
    methods: ["Crappie rig with minnows", "Tipped jigs", "Spreader rigs from pier"],
    baits: ["Emerald shiners (small)", "Fathead minnows", "Pieces of nightcrawler"],
    lures: ["Tungsten jigs 1/16–1/32 oz tipped with minnow head", "Small spreader rig with #6 hooks"],
    image: window.__resources?.yellow_perch_img || "images/species/yellow-perch.png",
    notes: "Schools roam in 25–45 ft. Look for marks on the sonar in fall.",
    behavior: "Tight-schooling panfish that moves vertically through the column with the thermocline. Daytime feeder — usually shuts down at night. Schools are often big and same-size: find one, find a hundred.",
    habitat: "25–45 ft mud and sand flats in fall; shallower in spring around reefs and harbors.",
    eatSafety: "Among the safest Lake Erie fish to eat — light, sweet fillets. Generally unrestricted in Ohio advisories, but check current guidance.",
    regulations: {"summary":"10/day (Cleveland / Central Zone), no min size","lakeErie":[{"window":"Mar 1 – Apr 30, 2026","limit":"West Zone 30 · Central Zone 10 · East Zone 20","minSize":"None"},{"window":"May 1, 2026 – Feb 28, 2027","limit":"TBA late April","minSize":"None"}],"inland":"30/day statewide, no min size.","notes":"Cleveland/Avon Lake fishing is in the Central Zone. Zone boundaries are at Huron Pier Lighthouse (west) and Fairport Harbor Lighthouse (east)."}
  },
  {
    name: "Steelhead",
    emoji: "🌈",
    color: "#7ec4cf",
    peakSeason: "Oct–Apr (rivers)",
    methods: ["Float fishing with spawn sacs", "Drifting jigs", "Spinners in lower river"],
    baits: ["Spawn sacs (steelhead eggs)", "Maggots", "Pink/orange sponge"],
    lures: ["1/32–1/8 oz marabou jigs (pink, black, white)", "Little Cleo spoon", "Mepps Aglia #2–3", "Blue Fox Vibrax"],
    image: window.__resources?.steelhead_img || "images/species/steelhead.png",
    notes: "Lake-run rainbows. Rocky, Vermilion, Chagrin, Conneaut all stocked. Run starts with first cold rains.",
    behavior: "Lake-run rainbow trout (anadromous-like behavior in Erie). Runs into tributaries after the first cold autumn rains, holds in deep pools, and feeds on eggs, nymphs, and baitfish. Highly visual and easily spooked in clear, low water.",
    habitat: "Rocky River, Chagrin, Conneaut, Grand, and Vermilion tributaries Oct–Apr; offshore in the lake summer.",
    eatSafety: "Edible — pink, salmon-like flesh. Lake Erie steelhead carry mild PCB advisories (typically 1 meal/month under Ohio guidance). Stocked stream rainbows are safer.",
    regulations: {"summary":"2/day · 12-inch minimum (Lake Erie & tributaries)","lakeErie":[{"window":"Mar 1 – May 15, 2026","limit":"2 (Trout/Salmon combined)","minSize":"12 in"},{"window":"May 16 – Aug 31, 2026","limit":"5 (Trout/Salmon combined)","minSize":"12 in"},{"window":"Sep 1, 2026 – Feb 28, 2027","limit":"2 (Trout/Salmon combined)","minSize":"12 in"}],"inland":"Statewide: 5/day combined, no min size.","notes":"Brook trout possession is prohibited on the Ashtabula, Chagrin, Conneaut, and Grand rivers and their tributaries."}
  },
  {
    name: "Smallmouth Bass",
    emoji: "🟫",
    color: "#a87850",
    peakSeason: "May–Oct",
    methods: ["Drop-shot finesse", "Tube jigs", "Hair jigs near rocks"],
    baits: ["Soft crayfish imitations", "Live shiners", "Gobies (where legal)"],
    lures: ["Z-Man TRD Ned rig", "Strike King Rage Tail Craw", "Rapala X-Rap", "3.5\" Yamamoto Senko wacky"],
    image: window.__resources?.smallmouth_bass_img || "images/species/smallmouth-bass.png",
    notes: "Lake Erie smallies are world-class — rocky breakwalls and reefs are the spots.",
    behavior: "Structure-oriented ambush feeder. Spawns on gravel in 4–8 ft in May/June, then moves to rocky points, reefs, and breakwall edges. Crayfish are the #1 forage — match the hatch with brown/orange tubes and ned rigs.",
    habitat: "Rocky breakwalls, reefs, and rip-rap shorelines; deeper rock humps in summer.",
    eatSafety: "Edible but mercury advisories apply (Ohio EPA suggests roughly 1 meal/month for Lake Erie smallmouth). Most local anglers practice catch-and-release.",
    regulations: {"summary":"5/day · 14-inch min (spawn window: 1 fish at 18 in)","lakeErie":[{"window":"Mar 1 – Apr 30, 2026","limit":"5 (Largemouth/Smallmouth/Spotted combined)","minSize":"14 in"},{"window":"May 1 – Jun 26, 2026 · spawning","limit":"1 combined","minSize":"18 in"},{"window":"Jun 27, 2026 – Feb 28, 2027","limit":"5 combined","minSize":"14 in"}],"inland":"Statewide: 5/day combined, 12-in min.","notes":"The May–June 18-inch / 1-fish window protects spawning fish. Most anglers practice catch-and-release year-round on Lake Erie."}
  },
  {
    name: "White Bass",
    emoji: "⚪",
    color: "#cfd8dc",
    peakSeason: "Apr–Jun (run), Jul–Aug (lake)",
    methods: ["Casting small spoons into schooling fish", "River drift in spring", "Vertical jigging"],
    baits: ["Small minnows", "Cut bait"],
    lures: ["1/4 oz Kastmaster", "Road Runner jig", "Mepps Aglia #2", "Joe's Flies"],
    image: window.__resources?.white_bass_img || "images/species/white-bass.png",
    notes: "Spring river run on the Maumee and Sandusky is legendary. Surface boils in summer.",
    behavior: "Pelagic schooling fish that pushes baitfish to the surface in summer — creates visible 'boils.' Spring spawning run up the Maumee, Sandusky, and Rocky is legendary; thousands of fish stack in shallow current.",
    habitat: "Open water mid-lake in summer; tributaries in spring.",
    eatSafety: "Edible — flaky, slightly oilier than walleye/perch. Lake Erie advisories suggest roughly 1 meal/month due to PCB; trim fat for best results.",
    regulations: {"summary":"Open year-round · no limit, no min size (Lake Erie)","lakeErie":[{"window":"Year-round","limit":"None","minSize":"None"}],"inland":"Statewide: 30/day combined (Striped/Hybrid/White), no more than 4 over 15 in.","notes":"Lake Erie white bass have no harvest restriction — keep what you'll eat."}
  },
  {
    name: "Largemouth Bass",
    emoji: "🟢",
    color: "#5fa86d",
    peakSeason: "May–Sep",
    methods: ["Texas rig plastics", "Topwater frogs in lily pads", "Spinnerbait"],
    baits: ["Live shiners", "Nightcrawlers"],
    lures: ["Senko wacky-rigged", "Booyah Buzz topwater", "Strike King KVD Square Bill", "Zoom Brush Hog"],
    image: window.__resources?.largemouth_bass_img || "images/species/largemouth-bass.png",
    notes: "Inland ponds and harbors. Hinckley, Findley, Punderson all good.",
    behavior: "Cover-loving ambush predator. Holds tight to weed lines, lily pads, fallen wood, and dock pilings. Hits reaction baits (spinnerbaits, topwater) when active and slow-falling soft plastics when neutral.",
    habitat: "Inland ponds, harbors, and protected backwaters. Hinckley, Findley, Punderson all classic Ohio largemouth waters.",
    eatSafety: "Edible. Inland pond largemouth are generally safer than lake fish; Lake Erie largemouth fall under similar mercury advisories as smallmouth.",
    regulations: {"summary":"5/day · 14-inch min (spawn window: 1 fish at 18 in)","lakeErie":[{"window":"Mar 1 – Apr 30, 2026","limit":"5 (Largemouth/Smallmouth/Spotted combined)","minSize":"14 in"},{"window":"May 1 – Jun 26, 2026 · spawning","limit":"1 combined","minSize":"18 in"},{"window":"Jun 27, 2026 – Feb 28, 2027","limit":"5 combined","minSize":"14 in"}],"inland":"Statewide: 5/day combined, 12-in min. Some inland lakes use 4-fish split limits or 18-in min — check site-specific rules.","notes":"Inland pond regulations vary by water body — most Cleveland Metroparks and ODNR lakes follow the statewide 5/12-in rule unless posted otherwise."}
  },
  {
    name: "Bluegill",
    emoji: "🔵",
    color: "#5b8fc7",
    peakSeason: "May–Aug",
    methods: ["Bobber + worm", "Small jigs"],
    baits: ["Red worms", "Wax worms", "Crickets"],
    lures: ["1/64–1/32 oz panfish jigs", "Trout Magnet", "Beetle Spin"],
    image: window.__resources?.bluegill_img || "images/species/bluegill.png",
    notes: "Kid-friendly. Beds in 3–6 ft from late May through June.",
    behavior: "Social colony spawner — males fan saucer-shaped beds in 3–6 ft from late May through June and aggressively defend them. Feeds throughout the day on insects, worms, and small minnows.",
    habitat: "Shallow weedy bays of inland ponds. Almost every stocked pond on this list holds bluegill.",
    eatSafety: "Among the safest panfish to eat. Unrestricted in most Ohio advisories. Sweet white fillets — pan-fry classic.",
    regulations: {"summary":"No statewide limit, no min size","inland":"Statewide: no limit, no min size on sunfish (which includes bluegill).","notes":"A few site-specific waters (Killdeer Plains, Oxbow, St. Joseph River WA) limit sunfish to 10/day. All Ohio waters: no minimum size."}
  },
  {
    name: "Carp",
    emoji: "🟡",
    color: "#c4a060",
    peakSeason: "May–Sep",
    methods: ["Hair rig with boilies", "Doughball bottom rig"],
    baits: ["Sweet corn", "Boilies", "Dough balls", "Bread"],
    lures: ["N/A — bait fish"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Common_carp.jpg?width=800",
    notes: "Big, powerful, underrated. Edgewater and harbors hold 20-lb+ fish.",
    behavior: "Bottom-feeding cyprinid with a phenomenal sense of taste and smell. Often visible 'mudding' in shallow water in spring. Wary and powerful — a 20+ pound fish on light tackle is a serious fight.",
    habitat: "Edgewater, river mouths, harbors, and warm-water discharges. Holds in 4–15 ft soft-bottom areas.",
    eatSafety: "Edible but oily and concentrates contaminants in fat. Lake Erie advisory typically limits carp to about 6 meals/year. Most anglers release.",
    regulations: {"summary":"No limit, no min size","inland":"Statewide: unregulated. May be taken by bow and arrow in addition to angling.","notes":"Common carp is a non-native species. Bowfishing is legal year-round."}
  },
  {
    name: "Channel Catfish",
    emoji: "🐱",
    color: "#8a7860",
    peakSeason: "May–Sep",
    methods: ["Bottom rig at night", "Stinkbait on circle hook"],
    baits: ["Chicken liver", "Cut shad", "Nightcrawler glob", "Sonny's Super Sticky stinkbait"],
    lures: ["N/A — bait fish"],
    image: window.__resources?.channel_catfish_img || "images/species/channel-catfish.png",
    notes: "Night bite is best. Soak bait in 8–15 ft of water near current.",
    behavior: "Nocturnal opportunist with chemoreceptors all over its body (essentially 'tasting' the water). Holds in current edges and deeper holes by day; cruises shallow at night to feed on cut bait, dead fish, and stinkbait.",
    habitat: "Inland ponds, harbors, and river mouths. Bottom-oriented in 8–15 ft near current.",
    eatSafety: "Edible — firm, mild fillets. Lake Erie/tributary catfish carry mild advisories (about 1 meal/month under Ohio guidance); inland pond cats are safer.",
    regulations: {"summary":"Under 28 in: no limit · 28 in+: 1/day (statewide)","inland":"Statewide: under 28 in — no limit. 28 in or larger — 1 fish/day. No statewide season.","notes":"Trophy regulation kicked in to protect big spawning channels. Most pond channels are well under 28 in."}
  },
  {
    name: "Rock Bass",
    emoji: "🪨",
    color: "#9a8770",
    peakSeason: "May–Sep",
    methods: ["Small jigs on rocky bottoms", "Live bait under bobber"],
    baits: ["Crayfish", "Minnows", "Worms"],
    lures: ["1/8 oz tube jig", "Small inline spinner"],
    image: window.__resources?.rock_bass_img || "images/species/rock-bass.png",
    notes: "Common in Rocky River and rip-rap. Red eyes give them away.",
    behavior: "Aggressive sunfish that holds in current breaks behind rocks. Hits small jigs and live bait readily — often the first fish a beginner catches on the Rocky River.",
    habitat: "Rocky River, rip-rap shorelines, and breakwalls. 2–8 ft over rock and gravel.",
    eatSafety: "Edible — small fillets, similar to bluegill. Generally unrestricted in Ohio advisories.",
    regulations: {"summary":"No statewide limit, no min size","inland":"Statewide: no limit, no min size (sunfish family).","notes":"Site-specific limits may apply at a few wildlife areas — check posted signs."}
  },
  {
    name: "White Perch",
    emoji: "⚪",
    color: "#bcc7d0",
    peakSeason: "Jun–Sep",
    methods: ["Same as yellow perch — small jigs + minnows"],
    baits: ["Minnows", "Pieces of nightcrawler"],
    lures: ["Tungsten jig + minnow", "Small spoon"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Morone_americana.jpg?width=800",
    notes: "Invasive but edible. Often mixed with yellow perch schools.",
    behavior: "Invasive cousin of striped bass that schools in dense numbers. Feeds opportunistically all day, often mixed with yellow perch. Considered a nuisance for outcompeting natives — anglers are encouraged to keep them.",
    habitat: "Open lake and harbors; mid-water schools.",
    eatSafety: "Edible — light, perch-like flavor. Ohio advisories suggest about 1 meal/month due to PCB in older fish. Keep your limit to reduce population.",
    regulations: {"summary":"No limit, no min size (Lake Erie & tributaries)","lakeErie":[{"window":"Year-round","limit":"None","minSize":"None"}],"inland":"Statewide: 30/day combined with white/striped/hybrid bass, no more than 4 over 15 in.","notes":"Invasive species — anglers are encouraged to keep them rather than release."}
  },
  {
    name: "Rainbow Trout",
    emoji: "🌈",
    color: "#d18ba2",
    peakSeason: "Apr–May, Oct–Nov (stocked ponds)",
    methods: ["PowerBait on slip-sinker", "Small spinners", "Wax worms under bobber"],
    baits: ["Berkley PowerBait (rainbow, chartreuse)", "Salmon eggs", "Wax worms", "Mini-marshmallow + worm"],
    lures: ["Mepps Aglia #1–2", "Panther Martin 1/8 oz", "Little Cleo 1/4 oz", "Trout Magnet"],
    image: window.__resources?.rainbow_trout_img || "images/species/rainbow-trout.png",
    notes: "Pond rainbows are stocker-size 9–12 in. Hit the day after release for limits.",
    behavior: "Stocked at 9–13 inches into Ohio ponds each spring. Cruises just under the surface for the first few days post-stocking, then settles into 6–12 ft as water warms. Most fish are caught within two weeks of release.",
    habitat: "Stocked ponds and small lakes (see ODNR District 3 list). Holds near aerators, inflows, and shaded shoreline.",
    eatSafety: "Stocked rainbows are among the safest fish to eat in Ohio — raised in clean hatcheries and released as catchable-size. Unrestricted in advisories.",
    regulations: {"summary":"5/day statewide (stocked ponds) · 12-inch min in Lake Erie tributaries","lakeErie":[{"window":"Mar 1 – May 15, 2026","limit":"2 (Trout/Salmon combined)","minSize":"12 in"},{"window":"May 16 – Aug 31, 2026","limit":"5 (Trout/Salmon combined)","minSize":"12 in"},{"window":"Sep 1, 2026 – Feb 28, 2027","limit":"2 (Trout/Salmon combined)","minSize":"12 in"}],"inland":"Statewide stocked ponds: 5/day, no min size.","notes":"Cold Creek above SR-2 (Erie County): 5/day, no min size. Lake Erie tributary fish are treated as Steelhead under the Trout/Salmon rule."}
  },
  {
    name: "Crappie",
    emoji: "🎯",
    color: "#a8b0c0",
    peakSeason: "Apr–May, Sep–Oct",
    methods: ["Minnow under slip bobber", "Curly-tail grubs on light jighead", "Trolling small cranks"],
    baits: ["Crappie minnows", "Wax worms"],
    lures: ["1/16 oz marabou jig", "Bobby Garland Baby Shad", "Mr. Crappie Slabalicious"],
    image: window.__resources?.crappie_img || "images/species/crappie.png",
    notes: "Spring shoreline spawn is best. Look for them on submerged brush.",
    behavior: "Schooling panfish that suspends mid-column. Spring spawn in 2–6 ft around brush and submerged wood; post-spawn, schools roam open water at the thermocline. Light bite — set the hook on the slightest 'tick.'",
    habitat: "Brushy bays and submerged structure in inland lakes (Hinckley, East Branch, Findley).",
    eatSafety: "Edible — among the most sought-after panfish for the table. Generally unrestricted in Ohio advisories.",
    regulations: {"summary":"No statewide limit, no min size","inland":"Statewide: no limit, no min size. Many inland reservoirs: 30/day, 9-in min — check site-specific list.","notes":"Crappie regulations vary widely by water body. Hinckley/East Branch follow statewide rules; many larger reservoirs (Mosquito Creek, Pleasant Hill, etc.) use the 30/9-in site-specific rule."}
  }
];

// ---------- BUOYS ----------
window.BUOYS = {
  nearshore: [
    { id: "45203", name: "Huron Nearshore (CWA)", lat: 41.39, lng: -82.55, group: "🎯 Nearshore" },
    { id: "45196", name: "Rocky River Nearshore (CWA)", lat: 41.49, lng: -81.87, group: "🎯 Nearshore" }
  ],
  offshore: [
    { id: "45005", name: "West Lake Erie", lat: 41.68, lng: -82.40, group: "🌊 Offshore" },
    { id: "45164", name: "Long Point", lat: 42.69, lng: -80.10, group: "🌊 Offshore" },
    { id: "45169", name: "Cleveland Offshore", lat: 41.54, lng: -81.69, group: "🌊 Offshore" }
  ],
  coastal: [
    { id: "VRMO1", name: "Vermilion (NWS)", lat: 41.42, lng: -82.36, group: "📍 Coastal NWS" },
    { id: "HHLO1", name: "Huron Harbor (NWS)", lat: 41.39, lng: -82.55, group: "📍 Coastal NWS" },
    { id: "CNDO1", name: "Cleveland (NWS)", lat: 41.54, lng: -81.64, group: "📍 Coastal NWS" }
  ]
};
window.BUOYS_FLAT = [
  ...window.BUOYS.nearshore,
  ...window.BUOYS.offshore,
  ...window.BUOYS.coastal
];

// ---------- SEASONAL DATA (12 months) ----------
// Hand-coded Lake Erie south shore monthly profile.
window.SEASONAL = [
  // Jan
  { airF: 30, waterF: 35, wind: "WSW", windMph: 18, waveFt: 4, clarity: "Stained",
    top: ["Steelhead", "Walleye", "Yellow Perch"],
    tip: "Tributaries fish best after a thaw. Hot Waters in Lorain is the only open-water option.",
    ratings: { "Walleye": 4, "Yellow Perch": 4, "Steelhead": 8, "Smallmouth Bass": 2, "White Bass": 2, "Largemouth Bass": 2, "Bluegill": 2, "Carp": 2, "Channel Catfish": 2, "Rock Bass": 2, "White Perch": 2, "Rainbow Trout": 6, "Crappie": 2 } },
  // Feb
  { airF: 32, waterF: 34, wind: "WSW", windMph: 17, waveFt: 4, clarity: "Stained",
    top: ["Steelhead", "Walleye", "Rainbow Trout"],
    tip: "Late-Feb steelhead push when nights stay above freezing. Float jigs in slow holes.",
    ratings: { "Walleye": 4, "Yellow Perch": 4, "Steelhead": 8, "Smallmouth Bass": 2, "White Bass": 2, "Largemouth Bass": 2, "Bluegill": 2, "Carp": 2, "Channel Catfish": 2, "Rock Bass": 2, "White Perch": 2, "Rainbow Trout": 6, "Crappie": 2 } },
  // Mar
  { airF: 42, waterF: 40, wind: "W", windMph: 16, waveFt: 3, clarity: "Stained",
    top: ["Walleye", "Steelhead", "White Bass"],
    tip: "Spring walleye stage off the river mouths. Jig vertical in 12–20 ft.",
    ratings: { "Walleye": 9, "Yellow Perch": 5, "Steelhead": 9, "Smallmouth Bass": 4, "White Bass": 5, "Largemouth Bass": 3, "Bluegill": 3, "Carp": 3, "Channel Catfish": 3, "Rock Bass": 3, "White Perch": 3, "Rainbow Trout": 7, "Crappie": 4 } },
  // Apr
  { airF: 52, waterF: 48, wind: "SW", windMph: 14, waveFt: 2.5, clarity: "Murky (spring runoff)",
    top: ["Walleye", "Steelhead", "White Bass"],
    tip: "Peak walleye spawn — reef runs are insane. Trout stocking begins in ponds.",
    ratings: { "Walleye": 10, "Yellow Perch": 6, "Steelhead": 8, "Smallmouth Bass": 6, "White Bass": 8, "Largemouth Bass": 5, "Bluegill": 4, "Carp": 5, "Channel Catfish": 5, "Rock Bass": 5, "White Perch": 5, "Rainbow Trout": 9, "Crappie": 7 } },
  // May
  { airF: 62, waterF: 58, wind: "SW", windMph: 12, waveFt: 2, clarity: "Clearing",
    top: ["Smallmouth Bass", "Walleye", "White Bass"],
    tip: "Smallmouth move shallow to spawn — drop-shot the rocks at Marblehead.",
    ratings: { "Walleye": 9, "Yellow Perch": 6, "Steelhead": 4, "Smallmouth Bass": 9, "White Bass": 9, "Largemouth Bass": 8, "Bluegill": 7, "Carp": 7, "Channel Catfish": 7, "Rock Bass": 7, "White Perch": 6, "Rainbow Trout": 7, "Crappie": 9 } },
  // Jun
  { airF: 72, waterF: 68, wind: "SSW", windMph: 10, waveFt: 2, clarity: "Clear",
    top: ["Walleye", "Smallmouth Bass", "Largemouth Bass"],
    tip: "Walleye scatter offshore — troll harnesses in 25–35 ft. Bluegill on beds.",
    ratings: { "Walleye": 8, "Yellow Perch": 6, "Steelhead": 2, "Smallmouth Bass": 9, "White Bass": 8, "Largemouth Bass": 9, "Bluegill": 9, "Carp": 8, "Channel Catfish": 8, "Rock Bass": 8, "White Perch": 7, "Rainbow Trout": 5, "Crappie": 7 } },
  // Jul
  { airF: 80, waterF: 74, wind: "SW", windMph: 9, waveFt: 1.5, clarity: "Clear",
    top: ["Walleye", "Smallmouth Bass", "Yellow Perch"],
    tip: "Offshore trolling bite. Night walleye casters work the pier lights.",
    ratings: { "Walleye": 8, "Yellow Perch": 7, "Steelhead": 1, "Smallmouth Bass": 8, "White Bass": 7, "Largemouth Bass": 8, "Bluegill": 8, "Carp": 8, "Channel Catfish": 9, "Rock Bass": 7, "White Perch": 8, "Rainbow Trout": 3, "Crappie": 5 } },
  // Aug
  { airF: 80, waterF: 76, wind: "SW", windMph: 9, waveFt: 1.5, clarity: "Clear",
    top: ["Yellow Perch", "Walleye", "Channel Catfish"],
    tip: "Perch schools fire up. Watch for algal bloom — fish dawn before it warms.",
    ratings: { "Walleye": 7, "Yellow Perch": 9, "Steelhead": 1, "Smallmouth Bass": 7, "White Bass": 7, "Largemouth Bass": 7, "Bluegill": 7, "Carp": 8, "Channel Catfish": 9, "Rock Bass": 7, "White Perch": 8, "Rainbow Trout": 2, "Crappie": 5 } },
  // Sep
  { airF: 70, waterF: 70, wind: "SW", windMph: 11, waveFt: 2, clarity: "Clearing",
    top: ["Yellow Perch", "Walleye", "Smallmouth Bass"],
    tip: "Perch bite peaks. School up in 30–45 ft off Lorain and Avon Lake.",
    ratings: { "Walleye": 8, "Yellow Perch": 10, "Steelhead": 4, "Smallmouth Bass": 8, "White Bass": 7, "Largemouth Bass": 7, "Bluegill": 6, "Carp": 7, "Channel Catfish": 7, "Rock Bass": 7, "White Perch": 8, "Rainbow Trout": 5, "Crappie": 7 } },
  // Oct
  { airF: 58, waterF: 60, wind: "WSW", windMph: 13, waveFt: 2.5, clarity: "Clear",
    top: ["Walleye", "Yellow Perch", "Steelhead"],
    tip: "Fall walleye run begins. Steelhead enter the rivers with the first cold rain.",
    ratings: { "Walleye": 9, "Yellow Perch": 9, "Steelhead": 8, "Smallmouth Bass": 7, "White Bass": 6, "Largemouth Bass": 6, "Bluegill": 4, "Carp": 5, "Channel Catfish": 5, "Rock Bass": 5, "White Perch": 7, "Rainbow Trout": 8, "Crappie": 7 } },
  // Nov
  { airF: 46, waterF: 50, wind: "WSW", windMph: 16, waveFt: 3.5, clarity: "Stained",
    top: ["Walleye", "Steelhead", "Yellow Perch"],
    tip: "Fall walleye blitz — body baits along the breakwalls after dark.",
    ratings: { "Walleye": 10, "Yellow Perch": 7, "Steelhead": 9, "Smallmouth Bass": 5, "White Bass": 4, "Largemouth Bass": 4, "Bluegill": 3, "Carp": 3, "Channel Catfish": 3, "Rock Bass": 3, "White Perch": 5, "Rainbow Trout": 6, "Crappie": 5 } },
  // Dec
  { airF: 36, waterF: 42, wind: "WSW", windMph: 18, waveFt: 4, clarity: "Stained",
    top: ["Steelhead", "Walleye", "Rainbow Trout"],
    tip: "River steelhead and shore walleye at Hot Waters. Bundle up.",
    ratings: { "Walleye": 6, "Yellow Perch": 5, "Steelhead": 9, "Smallmouth Bass": 3, "White Bass": 3, "Largemouth Bass": 2, "Bluegill": 2, "Carp": 2, "Channel Catfish": 2, "Rock Bass": 2, "White Perch": 3, "Rainbow Trout": 7, "Crappie": 3 } }
];

// ---------- TIME-OF-DAY PERIODS ----------
// Each: hour range [start, end), modifiers per species
window.TIME_PERIODS = [
  { name: "Pre-Dawn",   start: 4,  end: 6,
    mods: { "Walleye": +2, "Channel Catfish": +1, "Yellow Perch": 0, "Smallmouth Bass": +1, "Steelhead": +1, "Largemouth Bass": +1, "Bluegill": -1, "White Bass": 0, "Carp": +1, "Rainbow Trout": +1, "Rock Bass": 0, "White Perch": 0, "Crappie": +1 } },
  { name: "Dawn",       start: 6,  end: 8,
    mods: { "Walleye": +2, "Smallmouth Bass": +2, "Largemouth Bass": +2, "Yellow Perch": +1, "Steelhead": +2, "White Bass": +2, "Bluegill": +1, "Channel Catfish": 0, "Carp": +1, "Rainbow Trout": +2, "Rock Bass": +1, "White Perch": +1, "Crappie": +2 } },
  { name: "Morning",    start: 8,  end: 11,
    mods: { "Walleye": 0, "Smallmouth Bass": +1, "Largemouth Bass": +1, "Yellow Perch": +2, "Steelhead": +1, "White Bass": +1, "Bluegill": +1, "Channel Catfish": 0, "Carp": +1, "Rainbow Trout": +1, "Rock Bass": +1, "White Perch": +1, "Crappie": +1 } },
  { name: "Midday",     start: 11, end: 14,
    mods: { "Walleye": -2, "Smallmouth Bass": -1, "Largemouth Bass": -1, "Yellow Perch": +1, "Steelhead": -1, "White Bass": 0, "Bluegill": +1, "Channel Catfish": -1, "Carp": +1, "Rainbow Trout": 0, "Rock Bass": 0, "White Perch": +1, "Crappie": 0 } },
  { name: "Afternoon",  start: 14, end: 17,
    mods: { "Walleye": -1, "Smallmouth Bass": 0, "Largemouth Bass": 0, "Yellow Perch": +1, "Steelhead": 0, "White Bass": +1, "Bluegill": +1, "Channel Catfish": 0, "Carp": +1, "Rainbow Trout": +1, "Rock Bass": +1, "White Perch": +1, "Crappie": +1 } },
  { name: "Dusk",       start: 17, end: 20,
    mods: { "Walleye": +3, "Smallmouth Bass": +2, "Largemouth Bass": +2, "Yellow Perch": 0, "Steelhead": +1, "White Bass": +2, "Bluegill": +1, "Channel Catfish": +1, "Carp": +1, "Rainbow Trout": +1, "Rock Bass": +1, "White Perch": +1, "Crappie": +2 } },
  { name: "Night",      start: 20, end: 24,
    mods: { "Walleye": +2, "Smallmouth Bass": 0, "Largemouth Bass": +1, "Yellow Perch": -3, "Steelhead": 0, "White Bass": 0, "Bluegill": -3, "Channel Catfish": +3, "Carp": +1, "Rainbow Trout": -1, "Rock Bass": -1, "White Perch": -1, "Crappie": -1 } },
  { name: "Late Night", start: 0,  end: 4,
    mods: { "Walleye": +1, "Smallmouth Bass": -1, "Largemouth Bass": 0, "Yellow Perch": -3, "Steelhead": -1, "White Bass": -1, "Bluegill": -3, "Channel Catfish": +2, "Carp": +1, "Rainbow Trout": -2, "Rock Bass": -1, "White Perch": -2, "Crappie": -2 } }
];

window.MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
