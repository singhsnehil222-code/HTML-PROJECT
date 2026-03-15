# Pixel City 3D

> A browser-based 3D isometric city-builder simulation — no install, no build tools, open and play.

**Author:** Snehil Shailendra Singh  
**Course:** HTML5, CSS & JavaScript — B.Tech CSE 2025–29, Semester II  
**Institution:** ITM Skills University

---

## Overview

Pixel City 3D puts you in the role of Mayor of an empty grid. Place buildings, manage your economy, keep citizens happy, and grow your population to 1,000 to win — before your treasury hits zero.

The game runs entirely in the browser as a single HTML file (~170 KB). It uses **Three.js** for 3D rendering, a custom **HTML5 Canvas** pixel-art sky backdrop, the **Web Audio API** for sound, and **localStorage** for the leaderboard — no frameworks, no backend, no installation.

---

## Getting Started

```bash
# Clone or download the repository
git clone https://github.com/your-username/pixel-city-3d.git

# Open directly in any modern browser
open pixel_city_v6.html
```

No build step required. Works in Chrome, Firefox, Edge, and Safari.

---

## How to Play

### Win Condition
Grow your **population to 1,000 citizens** before your **treasury drops below $0**.

### Placing Buildings
1. Select a building from the **Build panel** (left sidebar)
2. Click any empty tile on the grid to place it
3. Cost is deducted immediately; population and happiness update in real time

### Demolishing
Select **Demolish** (key `D`) and click any building. You receive a **25% refund** on the original cost. Clearing jungle trees earns a random bonus ($15–$35).

### Economy
- **Factories** and **Shops** generate passive income every 4 seconds
- Every building has an **upkeep cost** deducted each economy tick (every 30 seconds)
- Visit the **Economy tab** to collect a **$50 Mayor Bonus** every 30 seconds
- Score = Population × 10 + Happiness × 5 + Money × 0.04 + Days × 2

---

## Controls

| Input | Action |
|-------|--------|
| **Left-drag** | Orbit camera |
| **Right-drag** | Pan camera |
| **Scroll wheel** | Zoom in / out |
| **Arrow keys / WASD** | Pan camera target |
| **Q / E** | Rotate camera left / right |
| **R** | Reset camera to default |
| **Space** | Cycle weather: Clear → Rain → Fog |
| **N** | Toggle night / day |
| **T** | Toggle traffic |
| **B** | Open Build panel |

### Building Hotkeys

| Key | Building | Key | Building |
|-----|----------|-----|----------|
| `H` | House | `J` | Hospital |
| `A` | Apartment | `C` | School |
| `K` | Skyscraper | `L` | Lake |
| `F` | Factory | `G` | Bridge |
| `S` | Shop | `E` | Fence |
| `P` | Park | `D` | Demolish |
| `B` | Bush | `R` | Road |

---

## Buildings

| Building | Cost | Population | Happiness | Income | Notes |
|----------|------|-----------|-----------|--------|-------|
| House | $200 | +4 | +2 | — | Starter residential |
| Apartment | $500 | +12 | +3 | — | Mid-density housing |
| Skyscraper | $1,500 | +40 | +1 | — | Unlocks when you save $1,500 |
| Factory | $500 | — | −3 | +$12 | Smoke particles, chimney |
| Shop | $350 | — | +3 | +$7 | Striped awning, window display |
| Park | $150 | +1 | +8 | — | Flower patches, night lamp |
| Bush | $30 | — | +2 | — | Decorative, direction-aware |
| Fence | $20 | — | — | — | Auto-rotates to neighbours |
| Road | $50 | — | — | — | Enables cars and street lamps |
| Hospital | $800 | +10 | +20 | — | Largest happiness boost |
| School | $600 | +8 | +12 | — | Flagpole, yellow facade |
| Lake | $100 | — | +5 | — | Depth-layered, lily pads, reeds |
| Bridge | $150 | — | +1 | — | Stone arch, lanterns, pedestrians |

---

## Features

### Pixel Sky Backdrop
A 2D canvas sits behind the transparent Three.js renderer and draws a full pixel-art sky every frame. Six colour channels (top, mid, horizon, far mountain, near mountain, ground) interpolate per-channel at 0.75×dt per frame — producing smooth ~5-second crossfades between four phases with no jarring jumps.

| Phase | Sky Colour | Highlights |
|-------|-----------|------------|
| Night | Deep navy `#020214` | Stars, pixel moon, window glows, fountain colour lights |
| Dawn | Purple → orange `#180E40` | Rising pixel sun with rays, fading stars, pink clouds |
| Day | Bright blue `#3888D8` | White pixel clouds, full directional sun, green mountains |
| Dusk | Red-orange `#221044` | Setting sun, horizon glow stripe, early stars |

Day cycle duration: ~3.5 minutes per full rotation.

### Lake & Bridge
- **Lake:** 4-layer water depth (deep navy centre → bright teal shallow edges), animated shimmer planes, lily pads with flowers, reed clusters that sway in a wind simulation, sandy bottom visible through edges
- **Bridge:** Stone-arch base (taller in middle sections), 7 wood deck planks per tile, stone balustrade railings, 4 lanterns that glow warm amber at night with live PointLight sources, 2 pixel pedestrians that walk across with arm-swing animation and direction reversal

### Fountain Night Lighting
The central plaza fountain has 4 coloured PointLights (blue, cyan, pink, gold) around the basin plus a central upward spotlight. All lights are off during the day and pulse independently at night, creating coloured water reflections on surrounding buildings.

### Wildlife
- **5 animals** (raccoon, hedgehog, fox, rabbit, squirrel) wander the map, pause, and change direction — each with pixel body, head, tail, and leg geometry
- **3 birds** fly at varying heights with flapping wing animation

### Sound Effects (Web Audio API)
All sounds are procedurally generated — no audio files required:

| Event | Sound |
|-------|-------|
| Place building | Bright 2-note blip |
| Demolish | Descending sawtooth crunch |
| Coin / income | 4-note ascending chime |
| Achievement | 5-note fanfare |
| Day phase change | Soft 3-note ambient chord |

---

## Technical Architecture

```
pixel_city_v6.html          Single self-contained file (~170 KB)
│
├── CSS                     UI panels, animations, toast notifications
├── HTML                    Game layout, build panel, right panel, modals
└── JavaScript
    ├── Three.js r128        3D scene, meshes, raycasting, shadows, lights
    ├── Sky Canvas (2D)      Pixel backdrop — mountains, sun, moon, stars, clouds
    ├── Game State (G{})     Money, population, happiness, score, grid, counts
    ├── Building System      DEFS{} — 13 types with cost/pop/happy/income
    ├── Economy Engine       Passive income, upkeep, processIncome(), hayDayCoinBurst()
    ├── Day/Night System     SKY presets, SKYPAL RGB channels, lerpSky(), applySky()
    ├── Camera               Orbit, pan, zoom, cinematic mode, auto-rotate
    ├── Wildlife             Pixel animals + birds with path-walking and animation
    ├── Lake/Bridge          Depth layers, shimmer, reeds, pedestrians, lanterns
    └── Web Audio API        Procedural SFX — no external audio files
```

### Key Design Decisions

**Why a single HTML file?**  
Zero dependency on a server, build tool, or package manager. A student or examiner can open it by double-clicking. This also keeps the submission simple and portable.

**Why transparent Three.js + 2D sky canvas?**  
Three.js's `setClearColor` paints a flat opaque colour — no gradients, mountains, or stars. Moving sky rendering to a `<canvas>` behind the WebGL canvas gives full pixel-art control over every part of the backdrop while keeping all 3D geometry correctly depth-sorted.

**Why per-channel RGB lerp instead of `Three.Color.lerp`?**  
`Three.Color.lerp` operates in linear RGB space but snaps its target instantly when the phase changes, causing visible colour jumps. Storing six sky zones as `[R, G, B]` arrays and lerping each channel independently at a framerate-proportional rate produces smooth cinematic transitions.

---

## Project Structure

```
pixel_city_v6.html          Main game file
PixelCity_Snehil.pptx       5-slide presentation (Snehil Shailendra Singh)
PixelCity_Report_Snehil.docx  Project report with tables and technical overview
README.md                   This file
```

---

## Colour Palette

| Swatch | Name | Hex | Used for |
|--------|------|-----|----------|
| ![navy](https://via.placeholder.com/14/0D1B2A/0D1B2A) | Deep Navy | `#0D1B2A` | Background, panels, night sky |
| ![blue](https://via.placeholder.com/14/1565C0/1565C0) | Pixel Blue | `#1565C0` | Accents, borders, UI highlights |
| ![green](https://via.placeholder.com/14/2E7D32/2E7D32) | Forest Green | `#2E7D32` | Parks, positive indicators |
| ![yellow](https://via.placeholder.com/14/FFD600/FFD600) | Pixel Yellow | `#FFD600` | Coins, score, title highlights |
| ![cream](https://via.placeholder.com/14/FFF9C4/FFF9C4) | Warm Cream | `#FFF9C4` | Body text on dark backgrounds |
| ![gray](https://via.placeholder.com/14/B0BEC5/B0BEC5) | Steel Gray | `#B0BEC5` | Secondary text, descriptions |

---

## Achievements

| Icon | Name | Condition |
|------|------|-----------|
| 🧱 | First Brick | Place your first building |
| 👥 | 100 Citizens | Reach 100 population |
| 🌆 | Boomtown | Reach 500 population |
| 🏙 | Metropolis | Reach 1,000 population (Win!) |
| 💰 | Gold Rush | Accumulate $10,000 |
| 🌳 | Green Mayor | Build 5 parks |
| 🏭 | Industrialist | Build 3 factories |
| 😄 | Happy City | 100% happiness with population > 0 |
| 📅 | Veteran Mayor | Survive 30 in-game days |
| ⭐ | High Scorer | Reach a score of 2,000 |

Each achievement grants a +100 score bonus.

---

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Safari 14+ | ✅ Full support |

Requires WebGL support (available in all modern browsers). Web Audio API requires a user gesture before audio can play — click anywhere to activate sound.

---

## Acknowledgements

- [Three.js r128](https://threejs.org/) — 3D rendering engine
- [Google Fonts](https://fonts.google.com/) — Press Start 2P, Nunito
- Pixel art aesthetic inspired by classic 16-bit city-builder games

---

*Pixel City 3D — Snehil Shailendra Singh · B.Tech CSE 2025–29 · ITM Skills University*
