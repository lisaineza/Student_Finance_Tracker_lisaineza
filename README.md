# Student Finance Tracker (Vanilla JS)

Live: https://YOUR_USERNAME.github.io/student-finance-tracker/

## Overview
Accessible, responsive budgeting app for students — semantic HTML, mobile-first CSS, and vanilla JS with regex validation & search, sorting, and localStorage persistence.

## Features
- Landmarks + skip link; ARIA live regions; visible focus; contrast-safe
- Responsive (360 / 768 / 1024), sticky table header, subtle transitions
- Regex validation (desc/amount/date/category) + advanced back-reference
- Live regex search with safe compiler + `<mark>` highlighting
- Sort by date / description / amount
- Stats: total records, sum, top category, last-7-days chart
- Budget cap with polite/assertive ARIA announcements
- localStorage; JSON import/export (light schema validation)
- Settings: categories & manual currency codes/rates
- Inline edit/delete with confirm; timestamps

## Regex Catalog
- Description: `^\S(?:[\s\S]*\S)?$`
- Amount: `^(0|[1-9]\d*)(\.\d{1,2})?$`
- Date: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
- Category: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
- Advanced (duplicate word): `\b(\w+)\s+\1\b`
- Examples: cents `/\.\d{2}\b/`, beverage `/(coffee|tea)/i`

## Keyboard Map
Tab through nav → forms → table actions. Enter to submit. Skip link jumps to `<main>`. Chart bars are buttons (click to filter by date).

## Setup
- Open `index.html` with VS Code **Live Server** (or any static host).
- Deploy via GitHub Pages: branch `main`, folder `/ (root)`.

## Tests
Open `tests.html` and ensure all checks show ✅.

## A11y Notes
- Landmarks & headings, form labels, aria-live status, focus states, reduced-motion respected.

## Academic Integrity
All UI/logic original. If you adapt any snippet, cite it here.
