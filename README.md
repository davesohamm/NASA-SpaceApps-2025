## 🚀 ISSperience

An interactive, gamified web experience for the NASA Space Apps Challenge 2025 celebrating 25 years of the International Space Station (ISS).

### Table of Contents
- Overview
- Live Features and Modules
- Quick Links (NASA resources)
- Installation and Local Development
- Project Structure
- Design, Accessibility, and UX
- Audio and Trophies
- Performance Targets
- License and Credits

---

## Overview

ISSperience invites users to explore life aboard the ISS through immersive modules: view Earth from the Cupola, train in simulated zero‑g, explore the Moon, learn from a knowledge hub, and earn certification by completing challenges. The landing page provides a smooth, animated entry with sounds, achievements, and interactions designed for education and delight.

### Challenge Context
- International Space Station 25th Anniversary Apps — NASA Space Apps 2025

### Core Goals
- Deliver captivating Cupola-style Earth observations
- Simulate Neutral Buoyancy Lab (NBL) training via engaging gameplay
- Provide real data views and educational context
- Ensure accessibility, responsiveness, and strong UX

---

## Live Features and Modules

### Landing Page Highlights
- Animated starfield, floating particles, and floating ISS
- Mission module cards with parallax tilt and hover effects
- Sound system with global toggle and background music
- Loading screen and notification system
- Trophy counter (0/12), Konami code easter egg, and micro‑interactions
- Quick Links modal in footer with official NASA resources

### Modules

1) 🪟 Cupola Window
- Status: Available entry point on landing (module page under construction)
- Goal: Interactive viewing experience with day/night cycles and points of interest

2) 🌍 Is My World Okay?!
- Status: Available — launches `modules/earth-check.html`
- Purpose: View stunning planetary imagery; designed for multi‑source reliability (EPIC/GOES/Himawari) and user controls (refresh, zoom, save)

3) 🎮 Zero‑G Training Lab
- Status: Available — launches `modules/zero-g-training.html`
- Purpose: Gamified NBL‑inspired training with tasks and physics interactions

4) 🌙 Lunar Observatory
- Status: Available — launches `modules/lunar-observatory.html`
- Purpose: Explore Moon surface and landing sites (3D content planned)

5) 📚 Knowledge Center
- Status: Available — launches `modules/knowledge-center.html`
- Purpose: Curated educational content, ISS timeline, Cupola facts, NBL insights

6) 🏆 Astronaut Certification
- Status: Locked until 12/12 trophies
- Purpose: Earn badges across modules to unlock certificate generation at `modules/astronaut-certificate.html`

---

## Quick Links (NASA resources)
Access the official references via the footer Quick Links modal or from here:
- Problem Statement: International Space Station 25th Anniversary Apps — `https://www.spaceappschallenge.org/2025/challenges/international-space-station-25th-anniversary-apps/`
- NASA Image and Video Library — `https://images.nasa.gov/`
- NASA Johnson Flickr — Cupola + NBL — `https://www.flickr.com/photos/nasa2explore/albums/`
- Station Research and Technology — `https://www.nasa.gov/international-space-station/space-station-research-and-technology/`
- NASA Open Data Portal (ISS Coords) — `https://data.nasa.gov/dataset/?q=ISS+Coords&sort=score+desc%2C+metadata_modified+desc`
- Neutral Buoyancy Lab Overview — `https://www.nasa.gov/johnson/neutral-buoyancy-laboratory/`
- EVA Systems Reference — `https://www.nasa.gov/reference/jsc-eva-systems/`
- Space Suits & Exploration Ops — `https://www.nasa.gov/directorates/esdmd/hhp/space-suits-and-exploration-operations/`

---

## Installation and Local Development

### Prerequisites
- Node.js 18+ (recommended) or any static file server

### Fast Start (Node)
```bash
npm start
# Opens http://localhost:8000 via http-server
```

### Alternative Dev Server
```bash
npm run dev
# Starts live-server at http://localhost:8000
```

### Manual Options
```bash
# Python
python -m http.server 8000

# Or open index.html directly (feature set may be reduced without a server)
```

---

## Project Structure
```text
NASA-SpaceApps-2025/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ main.js
├─ modules/
│  ├─ css/
│  ├─ js/
│  ├─ earth-check.html
│  ├─ cupola-view.html
│  ├─ zero-g-training.html
│  ├─ lunar-observatory.html
│  ├─ knowledge-center.html
│  └─ astronaut-certificate.html
├─ assets/
│  ├─ images/
│  └─ sounds/
├─ webgl-earth-master/ (vendor)
├─ globe.gl-master/ (vendor)
└─ docs/
```

---

## Design, Accessibility, and UX

### Visual System
- Color palette: deep space blues, bright cyan accents, warm orange highlights
- Glassmorphism cards, soft multi‑layer shadows, smooth 200–500ms transitions
- Responsiveness: desktop, tablet, and mobile layouts

### Accessibility
- Keyboard navigation with focus-visible outlines
- Respects `prefers-reduced-motion`
- ARIA labels on interactive controls
- Modal focus trapping for Quick Links dialog

---

## Audio and Trophies

### Audio System
- Global sound toggle (`🔊/🔇`), background music loop, click/hover/launch/achievement SFX
- Audio files live under `assets/sounds/` and are referenced directly from `js/main.js`

### Trophy System
- Tracks progress toward 12 trophies (stored in `localStorage`)
- Badge counter in the header updates in real time
- Certification module unlocks at 12/12

---

## Performance Targets
- First Contentful Paint: < 1.5s (landing)
- Time to Interactive: < 3s
- Lighthouse scores: 90+ across categories

---

## License and Credits

This project is created for the NASA Space Apps Challenge 2025. NASA imagery and data remain property of NASA and respective providers. Source code is MIT licensed unless stated otherwise.

Credits
- NASA Space Apps Challenge 2025 — challenge resources and inspiration
- NASA Image and Video Library, NASA Johnson Flickr, ISS Research & Technology
- globe.gl and WebGL Earth examples for exploration support

— Launch your mission at `http://localhost:8000` and enjoy the ISSperience!