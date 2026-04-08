# Interactive Wall Calendar

A polished Next.js calendar component inspired by the provided physical wall calendar reference.

## Features
- Physical wall-calendar look with spiral rings and paper texture styling
- Exact scenic hero image cropped from the provided reference image
- Click-to-select date range with start, in-between, and end-day states
- Notes panel tied to the visible month and selected date range
- localStorage persistence
- Responsive desktop/mobile layout
- Month navigation

## Run locally
```bash
npm install
npm run dev
```

Then open `http://localhost:3000`

## Project structure
- `app/page.tsx` – page entry
- `components/WallCalendar.tsx` – main interactive component
- `app/globals.css` – complete styling
- `public/calendar-hero.png` – scenic image cropped from the reference
- `public/reference-calendar.png` – original reference image

## Implementation choices
- No backend used
- Notes are stored in `localStorage`
- Styling is custom CSS for maximum visual control instead of UI libraries
