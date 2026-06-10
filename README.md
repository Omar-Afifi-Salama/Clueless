# Clueless — Project Idea Generator for Developers

A deterministic, client-side project prompt engine that generates structured software project ideas with difficulty metrics and time estimates.

## Overview

Clueless bypasses random word-shuffling failures by resolving constraints down a multi-layered relational tree pipeline. It selects compatible format, domain, and technology parameters, wraps them in natural-language templates, and assigns algorithmic difficulty and time scores based on additive modifier weights.

All data processing, state management, and persistence operate entirely within the browser via local storage — no server requests, no telemetry.

## Features

- **Deterministic Funnel Engine** — Filters cascade through paradigm branches, ensuring structural consistency between selected format, domain, and tech stack parameters.
- **Algorithmic Complexity Metrics** — Difficulty ratings (1–10) and time estimates are computed from base paradigm values plus additive node modifiers.
- **Export Pipeline** — Serialize history or favorites to `.txt`, `.md`, `.xlsx`, or `.json` via UI buttons or keyboard shortcuts.
- **Full Keyboard Navigation** — Focus dropdowns, generate prompts, bookmark favorites, clear collections, and trigger exports without touching the mouse.
- **Persistent State** — History and favorites are stored in `localStorage` and auto-saved on tab close.
- **Light/Dark Mode** — Toggle themes with persistent preference storage.
- **Custom Accent Color** — 24-color palette selector applied via CSS custom properties.

## Project Structure

```
├── css/
│   └── styles.css          # All site-wide and app-specific styling
├── data/
│   └── words.json          # Paradigm branches, formats, domains, tech stacks, audiences
├── html/
│   ├── index.html          # Landing page with features, about, and FAQ
│   ├── how-it-works.html   # Technical documentation and keyboard shortcut reference
│   └── app.html            # Main generator interface
├── scripts/
│   ├── app.js              # Generator engine, storage, export, keyboard event registry
│   └── navbar.js           # Theme toggle and accent color picker controller
└── README.md
```

## How It Works

### Prompt Generation Pipeline

1. **Paradigm Resolution** — If a paradigm is selected, all downstream options (format, domain, tech) are filtered to that branch. If left to randomize, the engine reverse-filters: it finds paradigm branches that contain all currently selected filters.

2. **Cascading Node Isolation** — Each selector (format, domain, tech, audience) picks from the resolved paradigm branch. Selections persist across paradigm changes when still valid.

3. **Template Compilation** — One of 20 natural-language templates is randomly chosen, and the four resolved keywords are injected with semantic CSS class tags for color-coded display.

4. **Metric Calculation** — Difficulty and estimated hours are computed as:
   - `Difficulty = Base Paradigm + Format Modifier + Domain Modifier + Tech Modifier` (clamped 1–10)
   - `Time = Base Paradigm Hours + Format Modifier + Domain Modifier + Tech Modifier` (minimum 2 hours)

### Keyboard Shortcuts

| Chord | Action |
|-------|--------|
| `Space` or `G` | Generate new prompt |
| `F` | Bookmark current prompt to favorites |
| `C` | Clear history (with confirmation) |
| `C` + `H` | Instant history flush |
| `C` + `F` | Instant favorites flush |
| `?` | Display help overlay |
| `Shift` + `P/F/D/T/A` | Focus and expand paradigm/format/domain/tech/audience dropdown |
| `E` + `H/F` + `T/M/X/J` | Export history/favorites as TXT/MD/XLSX/JSON |

## Data Model

The `data/words.json` file defines 12 paradigm branches, each containing:

- `base_difficulty` and `base_time` — root complexity weights for the branch
- `formats[]` — output types (CLI, SPA, mobile app, game, etc.) with individual modifiers
- `domains[]` — subject areas (cryptography, e-commerce, fitness, etc.) with modifiers
- `techs[]` — technology stacks (Rust, React, Swift, etc.) with modifiers
- `global_audiences[]` — 155 target user personas shared across all branches

## Technical Stack

- **HTML5** — Semantic markup with ARIA-compatible navigation
- **CSS3** — Custom properties for theming, CSS Grid/Flexbox layouts, responsive breakpoints
- **Vanilla JavaScript** — No frameworks; all DOM manipulation, state management, and event handling is native
- **SheetJS** — CDN-loaded for Excel export functionality

## Setup

Clone the repository and serve the root directory with any static file server:

```bash
git clone <repo-url>
cd project_idea_generator
python3 -m http.server 8000    # or use npx serve, live-server, etc.
```

Open `http://localhost:8000/html/index.html` in a browser. No build step, package manager, or environment configuration is required.

## Browser Compatibility

Tested on modern Chromium, Firefox, and Safari. Requires `localStorage` and ES6+ support.

## License

MIT