import { ClassId, EquipmentRarity, EquipmentSlot } from '../types/game';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const palette = (seed: number) => {
  const p1 = `hsl(${seed % 360}, 74%, 52%)`;
  const p2 = `hsl(${(seed * 2 + 40) % 360}, 62%, 18%)`;
  const p3 = `hsl(${(seed * 3 + 95) % 360}, 82%, 70%)`;
  const p4 = `hsl(${(seed * 5 + 170) % 360}, 82%, 60%)`;
  return { p1, p2, p3, p4 };
};

const classTheme = (classId: ClassId) => {
  if (classId === 'warrior') {
    return { hair: '#53d6b4', eyeTop: '#9afff2', eyeBottom: '#2aa596', costume: '#22304f', line: '#10182d' };
  }
  if (classId === 'mage') {
    return { hair: '#8d78ff', eyeTop: '#b8d3ff', eyeBottom: '#5578f2', costume: '#2f2f66', line: '#16183a' };
  }
  return { hair: '#ff6aa8', eyeTop: '#ffc3db', eyeBottom: '#e24386', costume: '#3a2644', line: '#281628' };
};

export const generateClassAvatar = (classId: ClassId, label: string): string => {
  const seed = classId.split('').reduce((sum, c) => sum + c.charCodeAt(0), 313);
  const { p1, p2, p3, p4 } = palette(seed);
  const t = classTheme(classId);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 520'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${p1}'/>
      <stop offset='100%' stop-color='${p2}'/>
    </linearGradient>
    <radialGradient id='light' cx='0.5' cy='0.12' r='0.85'>
      <stop offset='0%' stop-color='#ffffff' stop-opacity='0.24'/>
      <stop offset='100%' stop-color='#ffffff' stop-opacity='0'/>
    </radialGradient>
    <linearGradient id='skin' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#ffebdf'/>
      <stop offset='100%' stop-color='#fdd7c1'/>
    </linearGradient>
    <linearGradient id='eyeL' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='${t.eyeTop}'/>
      <stop offset='100%' stop-color='${t.eyeBottom}'/>
    </linearGradient>
    <linearGradient id='eyeR' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='${t.eyeTop}'/>
      <stop offset='100%' stop-color='${t.eyeBottom}'/>
    </linearGradient>
  </defs>

  <rect width='900' height='520' fill='url(#bg)'/>
  <rect width='900' height='520' fill='url(#light)'/>
  <circle cx='120' cy='88' r='54' fill='#fff' opacity='0.08'/>
  <circle cx='790' cy='74' r='72' fill='#fff' opacity='0.07'/>

  <g transform='translate(0,6)'>
    <path d='M300 462 Q450 498 600 462 L640 550 L260 550 Z' fill='${t.costume}' opacity='0.95'/>
    <path d='M336 446 Q450 476 564 446' stroke='${p3}' stroke-width='8' fill='none' opacity='0.8'/>

    <path d='M274 238 Q282 108 450 96 Q618 108 626 238 Q588 156 528 130 Q450 106 372 130 Q312 156 274 238 Z' fill='${t.hair}'/>
    <path d='M310 256 Q346 170 450 164 Q554 170 590 256 Q560 228 516 208 Q450 194 384 208 Q340 228 310 256 Z' fill='${t.hair}' opacity='0.82'/>
    <path d='M358 126 L430 190 L354 194 Z' fill='${p4}' opacity='0.48'/>

    <path d='M450 122 Q542 124 566 210 Q578 260 562 316 Q542 384 450 420 Q358 384 338 316 Q322 260 334 210 Q358 124 450 122 Z' fill='url(#skin)'/>

    <path d='M350 272 Q390 246 430 272' stroke='${t.line}' stroke-width='5' fill='none' stroke-linecap='round'/>
    <path d='M470 272 Q510 246 550 272' stroke='${t.line}' stroke-width='5' fill='none' stroke-linecap='round'/>

    <ellipse cx='394' cy='282' rx='30' ry='20' fill='#fff'/>
    <ellipse cx='506' cy='282' rx='30' ry='20' fill='#fff'/>
    <ellipse cx='394' cy='286' rx='16' ry='16' fill='url(#eyeL)'/>
    <ellipse cx='506' cy='286' rx='16' ry='16' fill='url(#eyeR)'/>
    <ellipse cx='394' cy='290' rx='8' ry='9' fill='#191e31'/>
    <ellipse cx='506' cy='290' rx='8' ry='9' fill='#191e31'/>
    <circle cx='388' cy='278' r='4' fill='#fff'/>
    <circle cx='500' cy='278' r='4' fill='#fff'/>

    <path d='M446 316 Q450 326 456 334' stroke='#c68b8b' stroke-width='3' fill='none' stroke-linecap='round'/>
    <path d='M398 356 Q450 386 502 356' stroke='#e75c89' stroke-width='8' fill='none' stroke-linecap='round'/>
    <ellipse cx='356' cy='334' rx='16' ry='10' fill='#ff9dc3' opacity='0.45'/>
    <ellipse cx='544' cy='334' rx='16' ry='10' fill='#ff9dc3' opacity='0.45'/>

    <path d='M324 236 Q364 214 408 230' stroke='${t.line}' stroke-width='4' fill='none' stroke-linecap='round'/>
    <path d='M492 230 Q536 214 576 236' stroke='${t.line}' stroke-width='4' fill='none' stroke-linecap='round'/>
  </g>

  <text x='450' y='486' text-anchor='middle' font-size='40' fill='#ffffff' font-family='Segoe UI, Noto Sans TC, sans-serif' letter-spacing='2'>${label}</text>
  </svg>`;

  return encodeSvg(svg);
};

export const generateMonsterPortrait = (name: string, emoji: string, stage: number): string => {
  const seed = name.split('').reduce((sum, c) => sum + c.charCodeAt(0), stage * 91);
  const { p1, p2, p3, p4 } = palette(seed);
  const eyeTop = stage % 2 === 0 ? '#ffc6df' : '#bde4ff';
  const eyeBottom = stage % 2 === 0 ? '#df4f8b' : '#4f8fe8';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540'>
  <defs>
    <linearGradient id='bgm' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${p1}'/>
      <stop offset='100%' stop-color='${p2}'/>
    </linearGradient>
    <radialGradient id='fog' cx='0.18' cy='0.16' r='0.9'>
      <stop offset='0%' stop-color='#fff' stop-opacity='0.2'/>
      <stop offset='100%' stop-color='#fff' stop-opacity='0'/>
    </radialGradient>
    <linearGradient id='monsterSkin' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#ffe5d6'/>
      <stop offset='100%' stop-color='#f6c8b5'/>
    </linearGradient>
    <linearGradient id='mEye' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='${eyeTop}'/>
      <stop offset='100%' stop-color='${eyeBottom}'/>
    </linearGradient>
  </defs>

  <rect width='960' height='540' fill='url(#bgm)'/>
  <rect width='960' height='540' fill='url(#fog)'/>
  <circle cx='808' cy='94' r='86' fill='#fff' opacity='0.06'/>

  <g transform='translate(0,8)'>
    <path d='M332 466 Q480 502 628 466 L668 560 L292 560 Z' fill='#1c2138' opacity='0.9'/>
    <path d='M352 450 Q480 486 608 450' stroke='${p4}' stroke-width='8' fill='none' opacity='0.7'/>

    <path d='M288 248 Q304 116 480 106 Q656 116 672 248 Q632 174 560 146 Q480 124 400 146 Q328 174 288 248 Z' fill='${p3}'/>
    <path d='M338 154 L388 198 L326 206 Z' fill='${p4}' opacity='0.56'/>
    <path d='M622 154 L572 198 L634 206 Z' fill='${p4}' opacity='0.56'/>

    <path d='M480 132 Q570 136 596 220 Q612 272 594 336 Q566 410 480 432 Q394 410 366 336 Q348 272 364 220 Q390 136 480 132 Z' fill='url(#monsterSkin)'/>

    <path d='M382 278 Q426 246 470 278' stroke='#1a1e31' stroke-width='5' fill='none' stroke-linecap='round'/>
    <path d='M490 278 Q534 246 578 278' stroke='#1a1e31' stroke-width='5' fill='none' stroke-linecap='round'/>

    <ellipse cx='426' cy='288' rx='32' ry='21' fill='#fff'/>
    <ellipse cx='534' cy='288' rx='32' ry='21' fill='#fff'/>
    <ellipse cx='426' cy='292' rx='17' ry='17' fill='url(#mEye)'/>
    <ellipse cx='534' cy='292' rx='17' ry='17' fill='url(#mEye)'/>
    <ellipse cx='426' cy='296' rx='8' ry='9' fill='#181b30'/>
    <ellipse cx='534' cy='296' rx='8' ry='9' fill='#181b30'/>
    <circle cx='420' cy='284' r='4' fill='#fff'/>
    <circle cx='528' cy='284' r='4' fill='#fff'/>

    <path d='M472 322 Q480 336 488 322' stroke='#c78080' stroke-width='3' fill='none' stroke-linecap='round'/>
    <path d='M422 364 Q480 404 538 364' stroke='#f05c8e' stroke-width='9' fill='none' stroke-linecap='round'/>
  </g>

  <text x='480' y='94' text-anchor='middle' font-size='54' font-family='Segoe UI Emoji'>${emoji}</text>
  <text x='480' y='506' text-anchor='middle' font-size='42' fill='#ffffff' font-family='Segoe UI, Noto Sans TC, sans-serif'>${name}</text>
  </svg>`;

  return encodeSvg(svg);
};

export const generateEquipmentImage = (slot: EquipmentSlot, level: number, rarity: EquipmentRarity): string => {
  const seed = slot.split('').reduce((a, c) => a + c.charCodeAt(0), level * 77);
  const { p1, p2, p3 } = palette(seed + 170);
  const badge = rarity === 'mythic' ? '✦' : rarity === 'legendary' ? '★' : rarity === 'advanced' ? '◆' : rarity === 'fine' ? '⬢' : '●';
  const slotLabel = { head: '頭', gloves: '手', weapon: '武', shield: '盾', necklace: '鍊', shoes: '鞋', armor: '衣', legs: '腿' }[slot];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${p1}'/>
      <stop offset='100%' stop-color='${p2}'/>
    </linearGradient>
  </defs>
  <rect width='220' height='220' rx='24' fill='url(#g)'/>
  <circle cx='110' cy='100' r='56' fill='${p3}' opacity='0.86'/>
  <text x='110' y='112' text-anchor='middle' font-size='34' fill='white' font-family='Noto Sans TC, sans-serif'>${slotLabel}</text>
  <text x='34' y='38' text-anchor='middle' font-size='28' fill='white'>${badge}</text>
  </svg>`;

  return encodeSvg(svg);
};
