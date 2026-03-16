# Color Picker Architecture

## Overview

The color picker is a bottom-sheet modal containing a canvas-based HSL gradient. Users press and drag to preview colors, and the color is committed on release.

## Key Files

| File | Purpose |
|------|---------|
| `src/components/canvas/RainbowPicker.tsx` | Bottom-sheet modal with HSL canvas and preview swatch |
| `src/components/canvas/ColorButton.tsx` | Toolbar button (color circle) that opens/closes RainbowPicker |
| `src/components/canvas/Toolbar.tsx` | Owns `showPicker` state, passes `onColorSelect` and `onClose` to RainbowPicker |
| `src/app/page.tsx` | Owns top-level `color` state, initialized to a random `hsl(H, 80%, 55%)` |
| `src/components/canvas/PotionMixer.tsx` | Alternative color picker — mixes two colors using RYB blending |
| `src/lib/colorMixer.ts` | RYB color mixing logic used by PotionMixer |

## Color Selection Flow

```
ColorButton clicked
  → Toolbar sets showPicker = true
  → RainbowPicker renders

User presses on canvas
  → pointerdown: setPointerCapture, sampleColor(), showPreview() via DOM ref
  → pointermove: sampleColor(), showPreview() via DOM ref
  → pointerup: onColorSelect(lastColor) → Toolbar.handleColorSelect → setColor in page.tsx
                clearPreview()
```

## RainbowPicker: Canvas Gradient

The canvas is 360×200px. It's drawn once on mount:
- **X axis** → Hue, 0–360°
- **Y axis** → Lightness, 10%–90%
- **Saturation** → Fixed at 100%

Colors are sampled by reading a single pixel with `getImageData`, then converting RGB bytes to a `#rrggbb` hex string.

## RainbowPicker: Preview Swatch

A `<div>` sits above the canvas and shows the color the user is currently hovering over while pressing. It is updated **directly via a DOM ref** (`previewRef.current.style.backgroundColor`), bypassing React state and re-renders entirely. This eliminates the frame-delay that occurs when using `useState` + re-render on every `pointermove` event.

**Do not convert this back to `useState`** — it will reintroduce visible lag on every pointer move.

## Pointer Handling Notes

- `setPointerCapture` is called on `pointerdown` so dragging outside the canvas bounds still registers moves and the final `pointerup`.
- `pointerleave` also triggers `handlePointerUp` as a fallback if capture fails.
- Color is committed only on `pointerup` / `pointerleave`, not on every move. This matches the expected UX: press-drag to preview, release to confirm.

## PotionMixer (Alternative Picker)

A separate modal opened via a potion-bottle toolbar button. It contains two `InlineColorPicker` subcomponents (same canvas approach as RainbowPicker) and mixes the two chosen colors using RYB (Red-Yellow-Blue) color theory from `src/lib/colorMixer.ts`. This produces artist-style blending (e.g. red + blue = purple) rather than light-based RGB blending.

## Libraries Evaluated (March 2026)

We evaluated replacing RainbowPicker with a third-party library to solve preview lag, but rejected both candidates in favor of a direct DOM-ref fix:

| Library | Bundle | Why rejected |
|---------|--------|--------------|
| **Pickr** (`@simonwep/pickr`) | ~40KB | Fixed popup/floating UI, doesn't support our bottom-sheet layout, uses HSV not HSL |
| **Coloris** (`@melloware/coloris`) | ~157KB + 12 deps | Designed for `<input>` fields, not a canvas bottom-sheet |

The actual fix was one line: write `previewRef.current.style.backgroundColor = color` instead of calling `setPreviewColor(color)`. Zero new dependencies, zero bundle cost.
