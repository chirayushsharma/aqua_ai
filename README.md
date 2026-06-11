# AquaAI — Water Pollution Detection System

A professional-grade AI water quality monitoring platform built with pure HTML, CSS, and JavaScript. No frameworks, no build tools — deploy anywhere in seconds.

## 🚀 Deploy on GitHub Pages (3 steps)

1. **Create a new GitHub repository** (e.g. `aquaai`)
2. **Upload all 3 files** — `index.html`, `style.css`, `app.js`
3. Go to **Settings → Pages → Source → Deploy from branch → `main` / `root`**

Your site will be live at:
```
https://<your-username>.github.io/aquaai/
```

---

## 📁 File Structure

```
aquaai/
├── index.html   ← All pages & markup
├── style.css    ← Design system, layout, components
├── app.js       ← Navigation, charts, AI simulation, interactions
└── README.md
```

---

## 📄 Pages Included

| Page | Description |
|------|-------------|
| **Home** | Hero section with orange glow, KPI stats, features grid |
| **Dashboard** | WQI ring, live sensor readings, mini KPI cards |
| **Live Monitor** | 6 parameter cards + interactive 24-hour trend chart |
| **AI Engine™** | Pollution Risk Score 0–100, animated bar, AI details |
| **Camera AI** | Upload image or run demo — detects 3 pollutants |
| **Map** | SVG River Ganga with 6 clickable station pins |
| **Analytics** | 4 charts: pH, turbidity, incidents, risk predictions |
| **Alerts** | Active + resolved alerts with severity coding |
| **Reports** | Auto-generate monthly PDF report preview |

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Charts:** Inline SVG (no library needed)
- **Icons:** Unicode emoji
- **Fonts:** System UI stack
- **Deployment:** Static — works on GitHub Pages, Netlify, Vercel, or any web server

---

## ✏️ Customisation

- **Colours** — Edit the CSS variables at the top of `style.css` under `:root`
- **Sensor values** — Update the hardcoded readings in `index.html`
- **Chart data** — Edit `CHART_DATA` object in `app.js`
- **Station names** — Edit the map pin `onclick` attributes in `index.html`

---

*Built for BSc IT final year project · SDG 6 Clean Water and Sanitation*
