import { Alignment, EventCard } from '../types/game';

const COMMON_POSITIVE: EventCard[] = [
  { id: 'ev_gold_shrine', title: '遺跡金庫', description: '你在遺跡裡找到散落金幣。', polarity: 'positive', rarity: 'normal' },
  { id: 'ev_skill_scroll', title: '古老卷軸', description: '你讀懂一段戰鬥技法。', polarity: 'positive', rarity: 'normal' },
  { id: 'ev_bless_armor', title: '守護祝福', description: '你的體能與防禦永久提升。', polarity: 'positive', rarity: 'normal' },
  { id: 'ev_lucky_cache', title: '幸運補給箱', description: '獲得高階藥水與裝備機會。', polarity: 'positive', rarity: 'rare' }
];

const COMMON_NEGATIVE: EventCard[] = [
  { id: 'ev_poison_mist', title: '毒霧陷阱', description: '短時間內攻防下降。', polarity: 'negative', rarity: 'normal' },
  { id: 'ev_bandit_tax', title: '路匪勒索', description: '你被迫支付過路金。', polarity: 'negative', rarity: 'normal' },
  { id: 'ev_curse_stone', title: '詛咒石碑', description: '短時間內爆擊與最大生命受限。', polarity: 'negative', rarity: 'rare' }
];

const ABYSS_EVENTS: EventCard[] = [
  { id: 'ev_abyss_relic', title: '深淵遺珍', description: '你從裂隙取得禁忌裝備。', polarity: 'positive', rarity: 'rare' },
  { id: 'ev_abyss_whisper', title: '深淵低語', description: '意志受到侵蝕，暫時降低戰鬥力。', polarity: 'negative', rarity: 'normal' }
];

const HEAVEN_EVENTS: EventCard[] = [
  { id: 'ev_heaven_oracle', title: '天界神諭', description: '神諭賜福，能力大幅提升。', polarity: 'positive', rarity: 'rare' },
  { id: 'ev_astral_trial', title: '星律試煉', description: '若通過試煉，將獲得傳說資源。', polarity: 'positive', rarity: 'rare' }
];

const DIVINE_EVENTS: EventCard[] = [
  {
    id: 'ev_divine_luminara',
    title: '曜星女神?露米娜菈',
    description: '被曜星女神選中，獲得特殊技能與大幅強化。',
    polarity: 'positive',
    rarity: 'mythic'
  },
  {
    id: 'ev_divine_elysion',
    title: '銀弦天琴座?艾莉希昂',
    description: '星座降臨，賦予神域祝福。',
    polarity: 'positive',
    rarity: 'mythic'
  }
];

const DEMON_EVENTS: EventCard[] = [
  {
    id: 'ev_demon_contract_morzath',
    title: '魔君「莫札薩斯」現身',
    description: '可選擇戰鬥或簽約。簽約後將與人類陣營敵對。',
    polarity: 'positive',
    rarity: 'mythic'
  },
  {
    id: 'ev_demon_contract_valkhar',
    title: '紅月魔女「瓦爾卡菈」現身',
    description: '可選擇戰鬥或簽約。簽約可獲得禁忌力量。',
    polarity: 'positive',
    rarity: 'mythic'
  },
  {
    id: 'ev_demon_contract_netherion',
    title: '深獄公爵「奈瑟里昂」現身',
    description: '可選擇戰鬥或簽約。簽約後旅程將全面改變。',
    polarity: 'positive',
    rarity: 'mythic'
  }
];

const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const rollTravelEvent = (stage: number, alignment: Alignment): EventCard | null => {
  const triggerChance = stage <= 50 ? 0.36 : 0.34;
  if (Math.random() > triggerChance) return null;

  if (alignment === 'human' && Math.random() < 0.007) {
    return randomFrom(DEMON_EVENTS);
  }

  if (Math.random() < 0.006) {
    return randomFrom(DIVINE_EVENTS);
  }

  if (stage > 1000 && Math.random() < 0.28) {
    return randomFrom(HEAVEN_EVENTS);
  }

  if (stage > 500 && Math.random() < 0.24) {
    return randomFrom(ABYSS_EVENTS);
  }

  const negativeRate = 0.16;
  if (Math.random() < negativeRate) {
    return randomFrom(COMMON_NEGATIVE);
  }

  return randomFrom(COMMON_POSITIVE);
};

