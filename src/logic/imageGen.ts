import { ClassId, EquipmentRarity, EquipmentSlot } from '../types/game';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const palette = (seed: number) => {
  const base = `hsl(${seed % 360}, 72%, 52%)`;
  const dark = `hsl(${(seed * 2 + 35) % 360}, 58%, 20%)`;
  const accent = `hsl(${(seed * 3 + 80) % 360}, 84%, 72%)`;
  const accent2 = `hsl(${(seed * 5 + 130) % 360}, 82%, 62%)`;
  return { base, dark, accent, accent2 };
};

const animeEye = (cx: number, cy: number, iris: string, id: string) => `
  <g>
    <ellipse cx='${cx}' cy='${cy}' rx='32' ry='24' fill='#fff'/>
    <ellipse cx='${cx}' cy='${cy + 2}' rx='18' ry='19' fill='url(#${id})'/>
    <ellipse cx='${cx}' cy='${cy + 4}' rx='10' ry='12' fill='#151a2d'/>
    <circle cx='${cx - 8}' cy='${cy - 6}' r='4' fill='#fff'/>
    <ellipse cx='${cx + 5}' cy='${cy + 7}' rx='2.8' ry='2' fill='#fff' opacity='0.85'/>
    <path d='M ${cx - 33} ${cy - 2} Q ${cx} ${cy - 17} ${cx + 33} ${cy - 2}' stroke='#101425' stroke-width='4' fill='none' stroke-linecap='round'/>
    <defs>
      <linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stop-color='${iris}'/>
        <stop offset='100%' stop-color='#2e3350'/>
      </linearGradient>
    </defs>
  </g>
`;

export const generateClassAvatar = (classId: ClassId, label: string): string => {
  const seed = classId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 271);
  const { base, dark, accent } = palette(seed);

  const hair = classId === 'mage' ? '#8f79ff' : classId === 'assassin' ? '#ff6ca6' : '#53d3a8';
  const iris = classId === 'mage' ? '#7fc3ff' : classId === 'assassin' ? '#ff7ea3' : '#65f0d0';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 520'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${base}'/>
      <stop offset='100%' stop-color='${dark}'/>
    </linearGradient>
    <radialGradient id='bloom' cx='0.5' cy='0.1' r='0.9'>
      <stop offset='0%' stop-color='#fff' stop-opacity='0.22'/>
      <stop offset='100%' stop-color='#fff' stop-opacity='0'/>
    </radialGradient>
    <linearGradient id='skin' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#ffe9dc'/>
      <stop offset='100%' stop-color='#ffd8c6'/>
    </linearGradient>
  </defs>

  <rect width='900' height='520' fill='url(#bg)'/>
  <rect width='900' height='520' fill='url(#bloom)'/>
  <circle cx='780' cy='88' r='82' fill='#fff' opacity='0.08'/>
  <circle cx='120' cy='92' r='58' fill='#fff' opacity='0.07'/>

  <g transform='translate(0,8)'>
    <ellipse cx='450' cy='282' rx='170' ry='158' fill='url(#skin)'/>
    <path d='M 258 260 Q 274 104 450 94 Q 626 104 642 260 Q 600 176 522 138 Q 450 120 378 138 Q 300 176 258 260 Z' fill='${hair}'/>
    <path d='M 286 280 Q 328 184 450 176 Q 572 184 614 280 Q 576 238 518 214 Q 450 194 382 214 Q 324 238 286 280 Z' fill='${hair}' opacity='0.86'/>

    ${animeEye(390, 280, iris, 'eye-left')}
    ${animeEye(510, 280, iris, 'eye-right')}

    <path d='M 447 318 Q 450 334 456 342' stroke='#d08f8f' stroke-width='3' fill='none' stroke-linecap='round'/>
    <path d='M 392 360 Q 450 392 508 360' stroke='#e85f8d' stroke-width='9' fill='none' stroke-linecap='round'/>
    <ellipse cx='338' cy='332' rx='18' ry='12' fill='#ff9cc4' opacity='0.4'/>
    <ellipse cx='562' cy='332' rx='18' ry='12' fill='#ff9cc4' opacity='0.4'/>

    <path d='M 322 414 Q 450 446 578 414 L 578 520 L 322 520 Z' fill='#1e243b' opacity='0.9'/>
    <path d='M 330 420 Q 450 454 570 420' stroke='${accent}' stroke-width='6' fill='none' opacity='0.8'/>
    <path d='M 312 260 Q 350 248 392 262' stroke='#171c2d' stroke-width='4' fill='none' stroke-linecap='round'/>
    <path d='M 508 262 Q 550 248 588 260' stroke='#171c2d' stroke-width='4' fill='none' stroke-linecap='round'/>
  </g>

  <text x='450' y='486' text-anchor='middle' font-size='44' fill='#ffffff' font-family='Segoe UI, Noto Sans TC, sans-serif' letter-spacing='2'>${label}</text>
  </svg>`;

  return encodeSvg(svg);
};

export const generateMonsterPortrait = (name: string, emoji: string, stage: number): string => {
  const seed = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), stage * 73);
  const { base, dark, accent, accent2 } = palette(seed + 97);

  const faceTone = stage % 2 === 0 ? '#ffe1d1' : '#ffd9c8';
  const eyeTone = stage % 2 === 0 ? '#ff6f95' : '#6dd5ff';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540'>
  <defs>
    <linearGradient id='bgm' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${base}'/>
      <stop offset='100%' stop-color='${dark}'/>
    </linearGradient>
    <radialGradient id='mist' cx='0.2' cy='0.15' r='1'>
      <stop offset='0%' stop-color='#fff' stop-opacity='0.2'/>
      <stop offset='100%' stop-color='#fff' stop-opacity='0'/>
    </radialGradient>
  </defs>

  <rect width='960' height='540' fill='url(#bgm)'/>
  <rect width='960' height='540' fill='url(#mist)'/>
  <circle cx='804' cy='102' r='96' fill='#fff' opacity='0.06'/>

  <g transform='translate(0,10)'>
    <ellipse cx='480' cy='292' rx='188' ry='166' fill='${faceTone}'/>
    <path d='M 286 282 Q 330 118 480 124 Q 630 118 674 282 Q 628 200 548 166 Q 480 150 412 166 Q 332 200 286 282 Z' fill='${accent}'/>
    <path d='M 308 302 Q 380 218 480 214 Q 580 218 652 302' stroke='${accent2}' stroke-width='12' fill='none' opacity='0.72'/>

    ${animeEye(410, 292, eyeTone, 'me1')}
    ${animeEye(550, 292, eyeTone, 'me2')}

    <path d='M 442 334 Q 480 346 518 334' stroke='#c18181' stroke-width='3' fill='none' opacity='0.8'/>
    <path d='M 408 374 Q 480 420 552 374' stroke='#ff6f92' stroke-width='11' fill='none' stroke-linecap='round'/>

    <path d='M 334 450 Q 480 482 626 450 L 626 560 L 334 560 Z' fill='#1a2138' opacity='0.88'/>
    <path d='M 346 454 Q 480 490 614 454' stroke='${accent2}' stroke-width='7' fill='none' opacity='0.72'/>
  </g>

  <text x='480' y='98' text-anchor='middle' font-size='58' font-family='Segoe UI Emoji'>${emoji}</text>
  <text x='480' y='504' text-anchor='middle' font-size='44' fill='#ffffff' font-family='Segoe UI, Noto Sans TC, sans-serif'>${name}</text>
  </svg>`;

  return encodeSvg(svg);
};

export const generateEquipmentImage = (slot: EquipmentSlot, level: number, rarity: EquipmentRarity): string => {
  const seed = slot.split('').reduce((a, c) => a + c.charCodeAt(0), level * 77);
  const { base, dark, accent } = palette(seed + 170);
  const badge = rarity === 'mythic' ? '✦' : rarity === 'legendary' ? '★' : rarity === 'advanced' ? '◆' : rarity === 'fine' ? '⬢' : '●';
  const slotLabel = { head: '頭', gloves: '手', weapon: '武', shield: '盾', necklace: '鍊', shoes: '鞋', armor: '衣', legs: '腿' }[slot];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${base}'/>
      <stop offset='100%' stop-color='${dark}'/>
    </linearGradient>
  </defs>
  <rect width='220' height='220' rx='24' fill='url(#g)'/>
  <circle cx='110' cy='100' r='56' fill='${accent}' opacity='0.86'/>
  <text x='110' y='112' text-anchor='middle' font-size='34' fill='white' font-family='Noto Sans TC, sans-serif'>${slotLabel}</text>
  <text x='34' y='38' text-anchor='middle' font-size='28' fill='white'>${badge}</text>
  </svg>`;

  return encodeSvg(svg);
};
