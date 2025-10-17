# Student Finance Tracker

An accessible, responsive single-page web app for tracking student expenses. Built with semantic HTML, mobile-first CSS, and vanilla ES modules. The project focuses on form validation, safe regex search, accessible UI, and simple persistence using localStorage.

## Quick start

Serve the project folder with a static HTTP server to avoid module import and fetch restrictions. Examples below work from the project root.

Windows (Command Prompt / PowerShell) with Python 3:

```cmd
cd C:\\path\\to\\Student_Finance_Tracker_lisaineza
python -m http.server 8000
```

Open http://localhost:8000 in your browser.

Cross-platform (Node):

```cmd
npx http-server -p 8000
```

Notes:
- Opening `index.html` directly (file:///) can block ES module imports or fetch() requests. Use a local server when testing.



## Features

- Add / edit / delete expense records with timestamps
- Native date picker (where supported) and keyboard entry fallback (YYYY-MM-DD)
- Strong field validation and clear, accessible error reporting
- Safe regex search with highlighting and match counts
- Sortable table columns (date, description, amount) and client-side filtering
- Dashboard: total records, sum, top category and remaining budget against a cap
- Last-7-days compact bar chart (interactive filter)
- Import / export JSON (light schema validation)
- Settings: categories list, budget cap, currency codes & rates (defaults: USD, CAD, RWF)
- Light/Dark theme with persisted preference and system-preference fallback
- Responsive layout, ARIA live regions, skip links and keyboard-friendly controls


## File map

- `index.html` — main app shell and markup
- `styles/style.css` — variables-based styling and dark mode rules
- `scripts/app.js` — app bootstrap and theme handling
- `scripts/ui.js` — DOM rendering, event binding, import/export, search and UI helpers
- `scripts/state.js` — in-memory state, mutations (upsert/remove), and pub/sub
- `scripts/storage.js` — localStorage wrapper and `defaultSettings()` (currencies and rates)
- `scripts/search.js` — safe regex compile and search helpers
- `scripts/validators.js` — regex catalog and `validateRecord()` implementing multiple rules
- `tests.html` — in-browser test harness for validator rules
- `seed.json` — optional seed data to load for demos



## Validators & tests

The app enforces several validation rules in `scripts/validators.js`. Key rules include:

- Description: trimmed, collapses multiple spaces, maximum length 200 characters
- Amount: numeric, optional 2 decimal places, must be greater than 0
- Date: `YYYY-MM-DD` format and cannot be in the future
- Category: allows letters, spaces, and hyphens only
- Advanced: duplicate-adjacent-word detection (regex back-reference)

Open `tests.html` in a browser to run the small assertions that exercise the validator rules. The page reports PASS/FAIL for each rule.


## Seed data format

`seed.json` (optional) is a JSON array of records. Minimal fields for each record:

```json
[
  {
    "id": "rec_123",
    "date": "2025-10-15",
    "description": "Lunch",
    "amount": 12.5,
    "category": "Food",
    "createdAt": "2025-10-15T10:00:00.000Z",
    "updatedAt": "2025-10-10T10:00:00.000Z"
  }
]
```

Load the seed via Settings -> Load Seed or use the import JSON control.



## Theme & accessibility

- Theme toggle ("Switch mode") appears in the header and persists to `localStorage` under the `theme` key.
- When the user hasn't chosen a preference, the app follows the system `prefers-color-scheme` setting and updates automatically.
- Accessibility: visible focus outlines, ARIA live regions for status messages, landmarks, and keyboard-friendly interactions.



## Troubleshooting

- Blank page or module import errors: make sure you're serving the site over HTTP (see Quick start).
- Date picker not shown: desktop browsers may not show native date pickers; manually type `YYYY-MM-DD` as a fallback.
- Dark mode not updating: clear cache (Ctrl+F5) and check the browser Console for errors.

If you report an issue, include the browser name/version and any Console errors.


## Youtube link 
https://youtu.be/jdKBBfjheYE

Contact: l.ineza@alustudent.com
https://lisaineza.github.io/Student_Finance_Tracker_lisaineza/

## Thank you!
