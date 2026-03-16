// RYB to RGB conversion using trilinear interpolation
// Cube corners map RYB → RGB
const RYB_TO_RGB: [number, number, number][] = [
  [255, 255, 255], // white  (0,0,0)
  [255, 0, 0],     // red    (1,0,0)
  [255, 255, 0],   // yellow (0,1,0)
  [255, 128, 0],   // orange (1,1,0)
  [66, 66, 255],   // blue   (0,0,1)
  [128, 0, 128],   // purple (1,0,1)
  [0, 155, 0],     // green  (0,1,1)
  [51, 51, 51],    // dark   (1,1,1)
];

function cubicInterp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function rybToRgb(r: number, y: number, b: number): [number, number, number] {
  // r, y, b in 0..1
  const rgb = [0, 0, 0] as [number, number, number];
  for (let i = 0; i < 3; i++) {
    const x0 = cubicInterp(r, RYB_TO_RGB[0][i], RYB_TO_RGB[1][i]);
    const x1 = cubicInterp(r, RYB_TO_RGB[2][i], RYB_TO_RGB[3][i]);
    const x2 = cubicInterp(r, RYB_TO_RGB[4][i], RYB_TO_RGB[5][i]);
    const x3 = cubicInterp(r, RYB_TO_RGB[6][i], RYB_TO_RGB[7][i]);
    const y0 = cubicInterp(y, x0, x1);
    const y1 = cubicInterp(y, x2, x3);
    rgb[i] = Math.round(cubicInterp(b, y0, y1));
  }
  return rgb;
}

function rgbToRyb(r: number, g: number, b: number): { ryb: [number, number, number]; w: number } {
  // Approximate inverse: remove whiteness, compute RYB
  const w = Math.min(r, g, b);
  r -= w; g -= w; b -= w;
  const mg = Math.max(r, g, b);

  let y = Math.min(r, g);
  r -= y; g -= y;

  if (b > 0 && g > 0) {
    b /= 2; g /= 2;
  }

  y += g;
  b += g;

  const my = Math.max(r, y, b);
  if (my > 0) {
    const n = mg / my;
    r *= n; y *= n; b *= n;
    return { ryb: [r / 255, y / 255, b / 255], w: w / 255 };
  }
  return { ryb: [0, 0, 0], w: w / 255 };
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}

export function mixColorsRYB(hex1: string, hex2: string): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);

  const c1 = rgbToRyb(r1, g1, b1);
  const c2 = rgbToRyb(r2, g2, b2);

  // Average in RYB space
  const mixed: [number, number, number] = [
    (c1.ryb[0] + c2.ryb[0]) / 2,
    (c1.ryb[1] + c2.ryb[1]) / 2,
    (c1.ryb[2] + c2.ryb[2]) / 2,
  ];

  // Renormalize to preserve saturation: averaging pulls toward the white corner.
  // Scale mixed values so max component matches the average of input max components.
  const mag1 = Math.max(...c1.ryb);
  const mag2 = Math.max(...c2.ryb);
  const targetMag = (mag1 + mag2) / 2;
  const mixedMag = Math.max(...mixed);
  if (mixedMag > 0 && targetMag > 0) {
    const scale = targetMag / mixedMag;
    mixed[0] = Math.min(1, mixed[0] * scale);
    mixed[1] = Math.min(1, mixed[1] * scale);
    mixed[2] = Math.min(1, mixed[2] * scale);
  }

  const [r, g, b] = rybToRgb(mixed[0], mixed[1], mixed[2]);

  // Blend whiteness back in
  const mixedW = (c1.w + c2.w) / 2;
  const wAdd = Math.round(mixedW * 255);
  return rgbToHex(
    Math.min(255, r + wAdd),
    Math.min(255, g + wAdd),
    Math.min(255, b + wAdd),
  );
}
