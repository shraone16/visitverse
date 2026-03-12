# VisitVerse — IVMS Project Structure

## Folder Layout

```
VisitVerse/
├── pages/
│   ├── index.html          ← Main entry point (landing + reg-home + auth-home)
│   ├── register.html       ← Visitor Pre-Registration (Module 01)
│   ├── safety.html         ← Department Safety Rules Engine (Module 02)
│   ├── assessment.html     ← Knowledge Assessment / MCQ Quiz (Module 04)
│   ├── verify.html         ← Identity Verification / OTP + Face (Module 05)
│   ├── gate.html           ← Contactless Gate Entry Control (Module 06)
│   └── dashboard.html      ← Admin Dashboard & Analytics (Module 07)
│
├── css/
│   ├── global.css          ← Variables, reset, body, nav, toast, footer
│   ├── components.css      ← Reusable UI: buttons, badges, cards, hero, chips
│   └── pages.css           ← Page-specific styles: landing, forms, safety,
│                              assessment, verify, gate, dashboard
│
└── js/
    ├── toast.js            ← showToast() notification helper
    ├── navigation.js       ← State, routing, showPage(), navigate(), updateNav()
    ├── registration.js     ← Multi-step form, department/PPE selection, QR pass
    ├── safety.js           ← safetyData object + loadSafety() renderer
    ├── assessment.js       ← Quiz engine: questions, timer, scoring, results
    ├── verify.js           ← OTP flow, liveness capture, FaceNet match steps
    ├── gate.js             ← Gate simulation, entry log, barrier animation
    └── dashboard.js        ← Chart.js charts, visitor table, anomaly alerts
```

## How to Run
Open `pages/index.html` in a browser. The page partials (register, safety, etc.)
are fetched via `fetch()` on load. For this to work, serve the project from a
local HTTP server, e.g.:

```bash
cd VisitVerse/pages
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080/index.html`

## Notes
- All CSS variables are defined in `css/global.css` under `:root`
- JS files must be loaded in order: toast → navigation → feature scripts
- Chart.js is loaded via CDN in `index.html`
- Google Fonts are loaded via CDN in `index.html`
