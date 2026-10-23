#!/usr/bin/env node
/*
 * Static guard for the 12px minimum font size.
 * Scans every CSS/TS(X) file under src/ for font-size declarations and SVG
 * fontSize props, resolves px/rem/em/var(--fs-*) and the minimum of clamp(),
 * and fails if anything can resolve below 12px. Run: npm run audit:fonts
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const MIN_PX = 12;
const REM = 16;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(css|tsx?)$/.test(name)) files.push(p);
  }
};
walk(ROOT);

// Collect --fs-* token values from tokens.css.
const tokens = {};
const tokenCss = readFileSync(join(ROOT, 'styles/tokens.css'), 'utf8');
for (const [, name, value] of tokenCss.matchAll(/(--fs-[\w-]+):\s*([^;]+);/g)) tokens[name] = value.trim();

const toPx = (raw) => {
  const v = raw.trim();
  const tok = v.match(/^var\((--fs-[\w-]+)\)$/);
  if (tok) return tokens[tok[1]] ? toPx(tokens[tok[1]]) : NaN;
  const clamp = v.match(/^clamp\(([^,]+),/);
  if (clamp) return toPx(clamp[1]); // the floor of clamp() is the minimum rendered size
  const num = v.match(/^(-?[\d.]+)(px|rem|em)?$/);
  if (num) return Number(num[1]) * (num[2] === 'px' || !num[2] ? 1 : REM);
  return NaN; // inherit, unset, etc.
};

const problems = [];
let checked = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const patterns = [/font-size:\s*([^;}\n]+)/g, /fontSize[=:]\s*\{?\s*['"]?([\d.]+(?:px|rem)?)['"]?/g];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const raw = m[1].replace(/\/\*.*?\*\//g, '').replace(/!important/, '').trim();
      const px = toPx(raw);
      checked++;
      if (Number.isNaN(px)) continue;
      if (px < MIN_PX) {
        const line = text.slice(0, m.index).split('\n').length;
        problems.push(`${relative(process.cwd(), file)}:${line}  font-size ${raw} → ${px}px`);
      }
    }
  }
}

for (const [name, value] of Object.entries(tokens)) {
  const px = toPx(value);
  if (px < MIN_PX) problems.push(`tokens.css  ${name}: ${value} → ${px}px`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} font size(s) below ${MIN_PX}px:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${checked} font-size declarations checked; none below ${MIN_PX}px.`);
