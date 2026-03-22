import { ClassId, EquipmentRarity, EquipmentSlot } from '../types/game';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const palette = (seed: number) => {
  const a = `hsl(${seed % 360}, 74%, 52%)`;
  const b = `hsl(${(seed * 2 + 40) % 360}, 66%, 24%)`;
  const c = `hsl(${(seed * 3 + 90) % 360}, 82%, 72%)`;
  const d = `hsl(${(seed * 5 + 120) % 360}, 70%, 60%)`;
  return { a, b, c, d };
};

export const generateClassAvatar = (classId: ClassId, label: string): string => {
  const seed = classId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 300);
  const { a, b, c } = palette(seed);

  const hair = classId === 'mage' ? '#8364ff' : classId === 'assassin' ? '#ff6fa2' : '#34d399';
  const eye = classId === 'mage' ? '#64b5ff' : classId === 'assassin' ? '#ff7aa8' : '#47e5c2';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 420'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${a}'/>
      <stop offset='100%' stop-color='${b}'/>
    </linearGradient>
    <radialGradient id='glow' cx='0.5' cy='0.2' r='0.8'>
      <stop offset='0%' stop-color='#ffffff' stop-opacity='0.25'/>
      <stop offset='100%' stop-color='#ffffff' stop-opacity='0'/>
    </radialGradient>
  </defs>
  <rect width='640' height='420' fill='url(#bg)'/>
  <rect width='640' height='420' fill='url(#glow)'/>
  <circle cx='540' cy='88' r='64' fill='#ffffff' opacity='0.08'/>
  <circle cx='110' cy='72' r='48' fill='#ffffff' opacity='0.07'/>

  <ellipse cx='320' cy='236' rx='148' ry='132' fill='#ffe7db'/>
  <path d='M168 212 Q188 90 320 84 Q452 90 472 212 Q438 140 374 114 Q320 96 266 114 Q202 140 168 212 Z' fill='${hair}'/>
  <path d='M184 222 Q240 132 320 128 Q400 132 456 222 Q424 178 368 160 Q320 144 272 160 Q216 178 184 222 Z' fill='${hair}' opacity='0.85'/>

  <ellipse cx='266' cy='230' rx='42' ry='30' fill='#fff'/>
  <ellipse cx='374' cy='230' rx='42' ry='30' fill='#fff'/>
  <ellipse cx='266' cy='232' rx='20' ry='24' fill='${eye}'/>
  <ellipse cx='374' cy='232' rx='20' ry='24' fill='${eye}'/>
  <ellipse cx='266' cy='234' rx='9' ry='11' fill='#1f2436'/>
  <ellipse cx='374' cy='234' rx='9' ry='11' fill='#1f2436'/>
  <circle cx='258' cy='224' r='5' fill='#fff'/>
  <circle cx='366' cy='224' r='5' fill='#fff'/>

  <path d='M286 296 Q320 320 354 296' stroke='#f472b6' stroke-width='10' fill='none' stroke-linecap='round'/>
  <circle cx='218' cy='266' r='14' fill='#ff9ec4' opacity='0.45'/>
  <circle cx='422' cy='266' r='14' fill='#ff9ec4' opacity='0.45'/>

  <text x='320' y='382' text-anchor='middle' font-size='42' fill='white' font-family='Segoe UI, Noto Sans TC, sans-serif'>${label}</text>
  <path d='M40 40 L68 40 L54 16 Z' fill='${c}' opacity='0.9'/>
  </svg>`;

  return encodeSvg(svg);
};

export const generateMonsterPortrait = (name: string, emoji: string, stage: number): string => {
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), stage * 53);
  const { a, b, c, d } = palette(seed + 111);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 420'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${a}'/>
      <stop offset='100%' stop-color='${b}'/>
    </linearGradient>
  </defs>
  <rect width='720' height='420' fill='url(#bg)'/>
  <circle cx='610' cy='88' r='76' fill='#fff' opacity='0.07'/>

  <ellipse cx='360' cy='236' rx='160' ry='136' fill='#ffe5d2'/>
  <path d='M198 212 Q248 92 360 96 Q472 92 522 212 Q486 156 426 132 Q360 112 294 132 Q234 156 198 212 Z' fill='${c}'/>
  <path d='M214 228 Q286 154 360 154 Q434 154 506 228' stroke='${d}' stroke-width='10' fill='none' opacity='0.65'/>

  <ellipse cx='300' cy='236' rx='44' ry='30' fill='#fff'/>
  <ellipse cx='420' cy='236' rx='44' ry='30' fill='#fff'/>
  <ellipse cx='300' cy='236' rx='18' ry='22' fill='#20263a'/>
  <ellipse cx='420' cy='236' rx='18' ry='22' fill='#20263a'/>
  <circle cx='294' cy='228' r='5' fill='#fff'/>
  <circle cx='414' cy='228' r='5' fill='#fff'/>

  <path d='M308 300 Q360 334 412 300' stroke='#fb7185' stroke-width='10' fill='none' stroke-linecap='round'/>
  <text x='360' y='84' text-anchor='middle' font-size='54' font-family='Segoe UI Emoji'>${emoji}</text>
  <text x='360' y='386' text-anchor='middle' font-size='38' fill='white' font-family='Segoe UI, Noto Sans TC, sans-serif'>${name}</text>
  </svg>`;

  return encodeSvg(svg);
};

export const generateEquipmentImage = (slot: EquipmentSlot, level: number, rarity: EquipmentRarity): string => {
  const seed = slot.split('').reduce((a, c) => a + c.charCodeAt(0), level * 77);
  const { a, b, c } = palette(seed + 170);
  const badge = rarity === 'mythic' ? '✦' : rarity === 'legendary' ? '★' : rarity === 'advanced' ? '◆' : rarity === 'fine' ? '⬢' : '●';
  const slotLabel = { head: '頭', gloves: '手', weapon: '武', shield: '盾', necklace: '鍊', shoes: '鞋', armor: '衣', legs: '腿' }[slot];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/></linearGradient></defs>
  <rect width='220' height='220' rx='24' fill='url(#g)'/>
  <circle cx='110' cy='96' r='52' fill='${c}' opacity='0.86'/>
  <text x='110' y='108' text-anchor='middle' font-size='34' fill='white' font-family='Noto Sans TC, sans-serif'>${slotLabel}</text>
  <text x='34' y='38' text-anchor='middle' font-size='28' fill='white'>${badge}</text>
  </svg>`;

  return encodeSvg(svg);
};
