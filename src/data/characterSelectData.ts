import { SelectableCharacter } from '../types/characterSelect';

export const CHARACTER_SELECT_DATA: SelectableCharacter[] = [
  {
    id: 'valeria',
    name: '瓦蕾莉亞',
    role: '戰士',
    title: '曙光重刃',
    element: '烈陽',
    skillSummary: '召喚聖焰護壁後突進斬擊，短時間大幅提升抗性與破甲能力。',
    stats: {
      hp: 188,
      atk: 34,
      def: 21,
      crit: 12
    },
    accent: 'from-amber-300/90 to-rose-400/80',
    glow: 'shadow-[0_0_40px_rgba(251,146,60,0.45)]',
    image:
      'https://image.pollinations.ai/prompt/anime%20girl%20full%20body%20warrior%20white%20and%20gold%20armor%20long%20flowing%20hair%20dramatic%20pose%20genshin%20impact%20style%20ultra%20detailed?width=768&height=1344&seed=9011'
  },
  {
    id: 'seraphine',
    name: '瑟菈菲',
    role: '法師',
    title: '星庭秘術師',
    element: '星霜',
    skillSummary: '釋放多段星軌法陣，壓制敵方並在爆發窗口給予高倍率魔法傷害。',
    stats: {
      hp: 132,
      atk: 47,
      def: 10,
      crit: 22
    },
    accent: 'from-cyan-300/90 to-indigo-400/80',
    glow: 'shadow-[0_0_40px_rgba(56,189,248,0.45)]',
    image:
      'https://image.pollinations.ai/prompt/anime%20girl%20full%20body%20mage%20blue%20violet%20robes%20floating%20runes%20cinematic%20lighting%20honkai%20star%20rail%20style%20ultra%20detailed?width=768&height=1344&seed=9012'
  },
  {
    id: 'noctis',
    name: '諾希絲',
    role: '刺客',
    title: '夜幕獵刃',
    element: '闇影',
    skillSummary: '高速位移切入背刺，累積處決印記後可觸發高爆擊連段終結。',
    stats: {
      hp: 146,
      atk: 39,
      def: 12,
      crit: 31
    },
    accent: 'from-fuchsia-300/90 to-violet-500/80',
    glow: 'shadow-[0_0_42px_rgba(232,121,249,0.45)]',
    image:
      'https://image.pollinations.ai/prompt/anime%20girl%20full%20body%20assassin%20black%20crimson%20combat%20outfit%20dual%20daggers%20dynamic%20action%20pose%20genshin%20inspired%20style%20ultra%20detailed?width=768&height=1344&seed=9013'
  }
];
