import { ClassId, EquipmentRarity, EquipmentSlot } from '../types/game';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const palette = (seed: number) => {
  const a = `hsl(${seed % 360}, 76%, 58%)`;
  const b = `hsl(${(seed * 2 + 40) % 360}, 70%, 28%)`;
  const c = `hsl(${(seed * 3 + 90) % 360}, 88%, 72%)`;
  return { a, b, c };
};

export const generateClassAvatar = (classId: ClassId, label: string): string => {
  const seed = classId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 300);
  const { a, b, c } = palette(seed);

  const hair = classId === 'mage' ? '#9f7aea' : classId === 'assassin' ? '#f472b6' : '#34d399';
  const eye = classId === 'mage' ? '#60a5fa' : classId === 'assassin' ? '#fb7185' : '#22d3ee';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${a}'/>
      <stop offset='100%' stop-color='${b}'/>
    </linearGradient>
  </defs>
  <rect width='320' height='240' fill='url(#g)'/>
  <circle cx='80' cy='55' r='40' fill='white' opacity='0.08'/>
  <circle cx='260' cy='40' r='28' fill='white' opacity='0.07'/>
  <ellipse cx='160' cy='132' rx='78' ry='72' fill='#ffe9de'/>
  <path d='M82 116 Q108 42 160 38 Q212 42 238 116 Q220 76 190 60 Q160 50 130 60 Q100 76 82 116 Z' fill='${hair}'/>
  <ellipse cx='132' cy='130' rx='20' ry='14' fill='white'/>
  <ellipse cx='188' cy='130' rx='20' ry='14' fill='white'/>
  <circle cx='132' cy='130' r='9' fill='${eye}'/>
  <circle cx='188' cy='130' r='9' fill='${eye}'/>
  <circle cx='129' cy='127' r='3' fill='white'/>
  <circle cx='185' cy='127' r='3' fill='white'/>
  <path d='M138 170 Q160 186 182 170' stroke='#fb7185' stroke-width='5' fill='none' stroke-linecap='round'/>
  <circle cx='106' cy='152' r='8' fill='#f9a8d4' opacity='0.45'/>
  <circle cx='214' cy='152' r='8' fill='#f9a8d4' opacity='0.45'/>
  <text x='160' y='220' text-anchor='middle' font-size='20' fill='white' font-family='sans-serif'>${label}</text>
  <path d='M30 18 L44 18 L37 6 Z' fill='${c}' opacity='0.9'/>
  <path d='M290 26 L302 26 L296 14 Z' fill='${c}' opacity='0.8'/>
  </svg>`;
  return encodeSvg(svg);
};

export const generateMonsterPortrait = (name: string, emoji: string, stage: number): string => {
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), stage * 53);
  const { a, b, c } = palette(seed + 111);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 240'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/></linearGradient></defs>
  <rect width='380' height='240' fill='url(#g)'/>
  <circle cx='320' cy='44' r='48' fill='white' opacity='0.07'/>
  <ellipse cx='190' cy='134' rx='96' ry='74' fill='#ffe6d1'/>
  <path d='M95 118 Q125 52 190 56 Q255 52 285 118 Q262 80 224 66 Q190 58 156 66 Q118 80 95 118Z' fill='${c}' opacity='0.9'/>
  <ellipse cx='154' cy='132' rx='22' ry='15' fill='white'/><ellipse cx='226' cy='132' rx='22' ry='15' fill='white'/>
  <circle cx='154' cy='132' r='9' fill='#1f2937'/><circle cx='226' cy='132' r='9' fill='#1f2937'/>
  <circle cx='151' cy='129' r='3' fill='white'/><circle cx='223' cy='129' r='3' fill='white'/>
  <path d='M160 172 Q190 190 220 172' stroke='#fb7185' stroke-width='6' fill='none' stroke-linecap='round'/>
  <text x='190' y='48' text-anchor='middle' font-size='36' font-family='Segoe UI Emoji'>${emoji}</text>
  <text x='190' y='224' text-anchor='middle' font-size='21' fill='white' font-family='sans-serif'>${name}</text>
  </svg>`;
  return encodeSvg(svg);
};

export const generateEquipmentImage = (slot: EquipmentSlot, level: number, rarity: EquipmentRarity): string => {
  const seed = slot.split('').reduce((a, c) => a + c.charCodeAt(0), level * 77);
  const { a, b, c } = palette(seed + 170);
  const badge = rarity === 'mythic' ? '✦' : rarity === 'legendary' ? '★' : rarity === 'advanced' ? '◆' : rarity === 'fine' ? '⬢' : '●';
  const slotLabel = { head: '頭', gloves: '手', weapon: '武', shield: '盾', necklace: '鍊', shoes: '鞋', armor: '衣', legs: '腿' }[slot];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/></linearGradient></defs>
  <rect width='180' height='180' rx='20' fill='url(#g)'/>
  <circle cx='90' cy='78' r='42' fill='${c}' opacity='0.9'/>
  <text x='90' y='92' text-anchor='middle' font-size='28' fill='white' font-family='sans-serif'>${slotLabel}</text>
  <text x='26' y='30' text-anchor='middle' font-size='22' fill='white'>${badge}</text>
  <text x='90' y='150' text-anchor='middle' font-size='18' fill='white'>Lv.${level}</text>
  </svg>`;
  return encodeSvg(svg);
};

