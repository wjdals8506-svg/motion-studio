// 4·5단계 금지 패턴 검사(G6): 컴포지션의 GSAP 타임라인 호출에서 director never-ship이 금지한 기본값을 찾는다.
// fade-slide-in(불투명도 0 + 위치 오프셋 진입), drift(착지 뒤 ease:'none' 이동), creep-scale(2초 넘게 0.1 이하 스케일),
// world-fade(화면 전체 층의 불투명도·색 트윈), no-ease(ease 없는 트윈). 의도한 것은 REVIEW.md "의도적으로 남긴 경고"에 이유를 적는다.
// ponytail: 정규식 휴리스틱이라 tl.to/fromTo/from 호출만 본다. 변수로 넘긴 vars·다른 타임라인 이름은 놓친다.
// CLI: node scripts/motion-lint.mjs <컴포지션 index.html>  → JSON 목록, 하나라도 있으면 exit 1
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// 괄호 안 인자를 깊이 0의 쉼표로 나눈다(문자열 안 쉼표·괄호는 무시)
function callArgs(src, open) {
  const args = [];
  let depth = 0, quote = null, start = open + 1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (quote) { if (c === quote && src[i - 1] !== '\\') quote = null; continue; }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) {
      if (--depth === 0) { args.push(src.slice(start, i).trim()); return args; }
    } else if (c === ',' && depth === 1) { args.push(src.slice(start, i).trim()); start = i + 1; }
  }
  return args;
}

const prop = (obj = '', key) => obj.match(new RegExp(`(?:^|[{,\\s])${key}\\s*:\\s*([^,}]+)`))?.[1].trim();
const num = v => (v === undefined ? NaN : Number(v.replace(/['"]/g, '')));
const ids = target => [...(target ?? '').matchAll(/['"]#([\w-]+)['"]/g)].map(m => m[1]);

// 화면 전체를 덮는 층: CSS 규칙이나 인라인 스타일에 inset: 0이 있는 id
function fullFrameIds(html) {
  const out = new Set();
  for (const [, sel, body] of html.matchAll(/([^{}]+)\{([^{}]*)\}/g))
    if (/inset\s*:\s*0(?![.\d])/.test(body)) for (const [, id] of sel.matchAll(/#([\w-]+)/g)) out.add(id);
  for (const [, id] of html.matchAll(/id="([\w-]+)"[^>]*style="[^"]*inset\s*:\s*0(?![.\d])/g)) out.add(id);
  return out;
}

export function lintMotion(html) {
  const full = fullFrameIds(html);
  const findings = [];
  for (const m of html.matchAll(/\btl\.(to|fromTo|from)\s*\(/g)) {
    const [target, a, b] = callArgs(html, m.index + m[0].length - 1);
    const kind = m[1];
    const from = kind === 'fromTo' || kind === 'from' ? a : undefined;
    const to = kind === 'fromTo' ? b : a;
    const line = html.slice(0, m.index).split('\n').length;
    const add = rule => findings.push({ rule, line, text: html.slice(m.index, html.indexOf('\n', m.index)).trim() });

    if (num(prop(from, 'opacity')) === 0 && ['x', 'y'].some(k => num(prop(from, k)) !== 0 && prop(from, k) !== undefined)) add('fade-slide-in');
    const literalTarget = /^['"[]/.test(target ?? '');
    if (literalTarget && /^['"]none['"]$/.test(prop(to, 'ease') ?? '') && ['x', 'y', 'scale'].some(k => prop(to, k) !== undefined)) add('drift');
    const dur = num(prop(to, 'duration'));
    const s1 = kind === 'fromTo' ? num(prop(from, 'scale')) : 1, s2 = num(prop(to, 'scale'));
    if (dur >= 2 && Number.isFinite(s1) && Number.isFinite(s2) && Math.abs(s2 - s1) <= 0.1 && s2 !== s1) add('creep-scale');
    if (ids(target).some(id => full.has(id)) && (prop(to, 'opacity') !== undefined || prop(to, 'backgroundColor') !== undefined)) add('world-fade');
    if (prop(to, 'ease') === undefined && prop(from, 'ease') === undefined) add('no-ease');
  }
  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node scripts/motion-lint.mjs <composition index.html>');
    process.exit(2);
  }
  const findings = lintMotion(fs.readFileSync(file, 'utf8'));
  console.log(JSON.stringify(findings, null, 2));
  if (findings.length) process.exit(1);
}
