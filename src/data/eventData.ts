import { EventCard } from '../types/game';

export const TRAVEL_EVENTS: EventCard[] = [
  { id: 'ev_gold_shrine', title: '遺跡金庫', description: '你在遺跡裡找到散落金幣。', polarity: 'positive' },
  { id: 'ev_skill_scroll', title: '古老卷軸', description: '你讀懂一段戰鬥技法。', polarity: 'positive' },
  { id: 'ev_bless_armor', title: '守護祝福', description: '你的體能與防禦短暫提升。', polarity: 'positive' },
  { id: 'ev_poison_mist', title: '毒霧陷阱', description: '你吸入毒霧，狀態下滑。', polarity: 'negative' },
  { id: 'ev_bandit_tax', title: '路匪勒索', description: '你被迫支付過路金。', polarity: 'negative' },
  { id: 'ev_curse_stone', title: '詛咒石碑', description: '你觸碰石碑，能力遭削弱。', polarity: 'negative' }
];

export const rollTravelEvent = (): EventCard | null => {
  if (Math.random() > 0.32) return null;
  return TRAVEL_EVENTS[Math.floor(Math.random() * TRAVEL_EVENTS.length)];
};
