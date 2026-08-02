import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const r = Math.round(size * 0.22);
  const cx = size / 2;
  const rx1 = Math.round(size * 0.28);
  const ry1 = Math.round(size * 0.35);
  const sw = Math.round(size * 0.04);
  const sw2 = Math.round(size * 0.03);
  const cy = Math.round(size * 0.48);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#f0fdf8"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx1}" ry="${ry1}" fill="#04bf94"/>
  <line x1="${cx}" y1="${Math.round(size*0.15)}" x2="${cx}" y2="${Math.round(size*0.82)}" stroke="white" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${Math.round(size*0.42)}" x2="${Math.round(size*0.28)}" y2="${Math.round(size*0.28)}" stroke="white" stroke-width="${sw2}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${Math.round(size*0.55)}" x2="${Math.round(size*0.72)}" y2="${Math.round(size*0.40)}" stroke="white" stroke-width="${sw2}" stroke-linecap="round"/>
</svg>`;

  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), svg);
  console.log(`Created icon-${size}.png`);
});

console.log('\nAll icons created in public/icons/');
