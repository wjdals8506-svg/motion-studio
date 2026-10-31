// 4단계 디자인 토큰(04_design/design_tokens.json)을 검사하고 CSS 변수로 바꾼다.
// 대비는 WCAG 2.x, 글자 크기 바닥은 HyperFrames check(2.6% H), 목표는 director composition.md(4% H).
// CLI: node scripts/design-tokens.mjs "projects/<slug>"  → JSON { errors, warnings }, 오류 있으면 exit 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const HEX = /^#[0-9a-f]{6}$/i;
const COLORS = ['ground', 'ink', 'muted', 'accent'];

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function checkTokens(tokens, { motion, fontExists }) {
  const errors = [];
  const warnings = [];
  const c = tokens.colors ?? {};
  for (const k of COLORS) if (!HEX.test(c[k] ?? '')) errors.push(`colors.${k}: #rrggbb 색이 아님 (${c[k]})`);
  if (HEX.test(c.ink ?? '') && HEX.test(c.ground ?? '') && contrast(c.ink, c.ground) < 4.5)
    errors.push(`colors.ink 대 ground 대비 ${contrast(c.ink, c.ground).toFixed(2)} < 4.5`);
  if (HEX.test(c.muted ?? '') && HEX.test(c.ground ?? '') && contrast(c.muted, c.ground) < 3)
    errors.push(`colors.muted 대 ground 대비 ${contrast(c.muted, c.ground).toFixed(2)} < 3.0`);

  const families = tokens.type?.families ?? {};
  for (const name of new Set(Object.values(families)))
    if (!fontExists(name)) errors.push(`글꼴 ${name}: 레포 assets/fonts/에 woff2와 LICENSE가 없음`);
  for (const [role, r] of Object.entries(tokens.type?.roles ?? {})) {
    if (!(r.family in families)) errors.push(`type.roles.${role}: family '${r.family}'가 type.families에 없음`);
    if (!r.readable) continue;
    if (r.size_h < 0.026) errors.push(`type.roles.${role}: 읽는 글자 ${r.size_h}H < 바닥 0.026H`);
    else if (r.size_h < 0.04) warnings.push(`type.roles.${role}: 읽는 글자 ${r.size_h}H < 목표 0.04H`);
  }

  const names = new Set([...Object.keys(motion.easings ?? {}), ...Object.keys(motion.measured_eases ?? {})]);
  for (const k of ['enter', 'exit'])
    if (!names.has(tokens.motion?.[k])) errors.push(`motion.${k}: '${tokens.motion?.[k]}'가 tokens/motion.json에 없음`);
  if (!['still', 'breathe'].includes(tokens.motion?.idle)) errors.push(`motion.idle: '${tokens.motion?.idle}'는 still 또는 breathe`);
  return { errors, warnings };
}

export function tokensToCss(tokens, height) {
  const lines = [
    ...Object.entries(tokens.colors).map(([k, v]) => `--color-${k}: ${v};`),
    ...Object.entries(tokens.type.families).map(([k, v]) => `--font-${k}: '${v}', sans-serif;`),
    ...Object.entries(tokens.type.roles).flatMap(([k, r]) => [
      `--type-${k}-size: ${Math.round(r.size_h * height)}px;`,
      `--type-${k}-weight: ${r.weight};`,
      `--type-${k}-line: ${r.line};`,
      `--type-${k}-tracking: ${r.tracking}em;`,
      `--type-${k}-family: var(--font-${r.family});`,
    ]),
  ];
  return `:root {\n  ${lines.join('\n  ')}\n}`;
}

// 레포 assets/fonts/<글꼴 이름 소문자, 공백은 ->/ 에 woff2와 LICENSE가 있어야 쓴다.
export const fontDir = family => path.join(ROOT, 'assets', 'fonts', family.toLowerCase().replace(/\s+/g, '-'));
export function fontExists(family) {
  const dir = fontDir(family);
  if (!fs.existsSync(dir)) return false;
  const files = fs.readdirSync(dir);
  return files.some(f => f.endsWith('.woff2')) && files.some(f => /^LICENSE/i.test(f));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/design-tokens.mjs "<project dir>"');
    process.exit(2);
  }
  const tokens = JSON.parse(fs.readFileSync(path.join(dir, '04_design', 'design_tokens.json'), 'utf8'));
  const motion = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens', 'motion.json'), 'utf8'));
  const r = checkTokens(tokens, { motion, fontExists });
  console.log(JSON.stringify(r, null, 2));
  if (r.errors.length) process.exit(1);
}
