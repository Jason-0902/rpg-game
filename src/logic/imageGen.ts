import { ClassId, EquipmentSlot } from '../types/game';

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const palette = (seed: number) => {
  const a = `hsl(${seed % 360}, 70%, 52%)`;
  const b = `hsl(${(seed * 2 + 40) % 360}, 72%, 34%)`;
  const c = `hsl(${(seed * 3 + 90) % 360}, 75%, 64%)`;
  return { a, b, c };
};

export const generateClassAvatar = (classId: ClassId, label: string): string => {
  const seed = classId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 300);
  const { a, b, c } = palette(seed);

  const hair = classId === 'mage' ? '#8b5cf6' : classId === 'assassin' ? '#ec4899' : '#10b981';
  const eye = classId === 'mage' ? '#60a5fa' : classId === 'assassin' ? '#f472b6' : '#34d399';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 220'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/></linearGradient></defs>
  <rect width='300' height='220' fill='url(#g)'/>
  <circle cx='150' cy='110' r='72' fill='#fde7d6'/>
  <path d='M78 94 Q150 14 222 94 Q220 54 196 30 Q150 6 104 30 Q80 54 78 94 Z' fill='${hair}'/>
  <ellipse cx='124' cy='110' rx='16' ry='12' fill='white'/>
  <ellipse cx='176' cy='110' rx='16' ry='12' fill='white'/>
  <circle cx='124' cy='110' r='7' fill='${eye}'/><circle cx='176' cy='110' r='7' fill='${eye}'/>
  <circle cx='121' cy='107' r='2' fill='white'/><circle cx='173' cy='107' r='2' fill='white'/>
  <path d='M130 146 Q150 160 170 146' stroke='#ef718a' stroke-width='5' fill='none' stroke-linecap='round'/>
  <text x='150' y='202' text-anchor='middle' font-size='20' fill='white' font-family='sans-serif'>${label}</text>
  <circle cx='34' cy='34' r='18' fill='${c}' opacity='0.55'/><circle cx='266' cy='32' r='14' fill='${c}' opacity='0.4'/>
  </svg>`;
  return encodeSvg(svg);
};

export const generateMonsterPortrait = (name: string, emoji: string, stage: number): string => {
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), stage * 53);
  const { a, b, c } = palette(seed + 111);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 220'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/></linearGradient></defs>
  <rect width='360' height='220' fill='url(#g)'/>
  <ellipse cx='180' cy='120' rx='92' ry='70' fill='#f3d0c0'/>
  <path d='M90 102 Q120 45 180 54 Q240 45 270 102 Q245 72 220 64 Q180 56 140 64 Q115 72 90 102Z' fill='${c}' opacity='0.9'/>
  <ellipse cx='145' cy='118' rx='20' ry='14' fill='white'/><ellipse cx='215' cy='118' rx='20' ry='14' fill='white'/>
  <circle cx='145' cy='118' r='8' fill='#111827'/><circle cx='215' cy='118' r='8' fill='#111827'/>
  <path d='M150 154 Q180 172 210 154' stroke='#fb7185' stroke-width='6' fill='none' stroke-linecap='round'/>
  <text x='180' y='36' text-anchor='middle' font-size='30' font-family='Segoe UI Emoji'>${emoji}</text>
  <text x='180' y='206' text-anchor='middle' font-size='20' fill='white' font-family='sans-serif'>${name}</text>
  </svg>`;
  return encodeSvg(svg);
};

export const generateEquipmentImage = (slot: EquipmentSlot, level: number, rarity: 'common' | 'rare' | 'epic'): string => {
  const seed = slot.split('').reduce((a, c) => a + c.charCodeAt(0), level * 77);
  const { a, b, c } = palette(seed + 170);
  const badge = rarity === 'epic' ? '★' : rarity === 'rare' ? '◆' : '●';
  const slotLabel = { head: '頭', gloves: '手', weapon: '武', shield: '盾', necklace: '鍊', shoes: '鞋', armor: '衣', legs: '腿' }[slot];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/></linearGradient></defs>
  <rect width='180' height='180' rx='20' fill='url(#g)'/>
  <circle cx='90' cy='78' r='42' fill='${c}' opacity='0.9'/>
  <text x='90' y='90' text-anchor='middle' font-size='28' fill='white' font-family='sans-serif'>${slotLabel}</text>
  <text x='26' y='30' text-anchor='middle' font-size='22' fill='white'>${badge}</text>
  <text x='90' y='150' text-anchor='middle' font-size='18' fill='white'>Lv.${level}</text>
  </svg>`;
  return encodeSvg(svg);
};
