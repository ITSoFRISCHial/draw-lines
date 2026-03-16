# Draw Lines

A drawing game where you create artwork and then walk through a 3D museum gallery to admire your creations. Designed by a 5-year-old, built for mobile.

## Features

- Full-screen drawing canvas with multiple brush sizes and colors
- 3D museum gallery that displays your saved drawings as framed paintings on the walls
- Walk through rooms of artwork using keyboard (desktop) or touch controls (mobile)
- Drawings are stored locally in your browser — no account needed
- Paintings display at their original aspect ratio (portrait drawings get tall frames, landscape gets wide frames)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your device. Optimized for iPhone 15 Pro.

## Tech Stack

- **Next.js** (App Router)
- **React Three Fiber** + **Three.js** for the 3D museum
- **Fabric.js** for the drawing canvas
- **Dexie** (IndexedDB) for local drawing storage
- **Tailwind CSS** for styling
