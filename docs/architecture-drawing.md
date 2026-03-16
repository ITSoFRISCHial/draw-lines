# Drawing Canvas Architecture

## Overview

The drawing canvas is a full-viewport Fabric.js canvas (`DrawingCanvas.tsx`) that supports freehand drawing, stamp placement, emoji placement, and sparkle trails.

## Input Handling

Fabric.js abstracts mouse and touch events into unified `mouse:down`, `mouse:up`, and `mouse:move` events. The canvas tracks drawing state via an `isDrawing` ref (set on `mouse:down`, cleared on `mouse:up`) rather than checking `PointerEvent.buttons`, because mobile touch events report `buttons === 0`.

## Sparkle Trail System

When sparkles are enabled (`sparkleEnabled` prop), the `mouse:move` handler:
1. Checks `isDrawing` ref to confirm an active stroke
2. Measures distance from last sparkle position
3. If distance exceeds `SPARKLE_INTERVAL`, places a gold 4-point star (`fabric.Path`)
4. On `path:created`, all sparkles from the current stroke are brought to front above the drawn path

Sparkle state is tracked in two refs:
- `lastSparklePos` — last position a sparkle was placed (reset per stroke)
- `strokeSparkles` — array of sparkle objects for the current stroke

## Tools

| Tool | Mode | Behavior |
|------|------|----------|
| `draw` | `isDrawingMode: true` | Freehand PencilBrush drawing |
| `stamp` | `isDrawingMode: false` | Click/tap places an SVG stamp recolored to current color |
| `emoji` | `isDrawingMode: false` | Click/tap places emoji text |

## Key Files

| File | Purpose |
|------|---------|
| `src/components/canvas/DrawingCanvas.tsx` | Main canvas component with drawing, stamps, emoji, sparkles |
| `src/components/canvas/SparkleToggle.tsx` | Toggle button for sparkle mode |
| `src/lib/constants.ts` | `SPARKLE_INTERVAL` and other shared constants |
