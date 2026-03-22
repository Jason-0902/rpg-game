export interface UpgradeZhText {
  title: string;
  description: string;
}

export const UPGRADE_TEXT_ZH: Record<string, UpgradeZhText> = {
  u_hp_small: { title: '生命核心', description: '最大生命 +28，並恢復 20 生命' },
  u_hp_large: { title: '泰坦之血', description: '最大生命 +50，並恢復 35 生命' },
  u_atk_small: { title: '鋒刃研磨', description: '攻擊 +6' },
  u_atk_medium: { title: '戰鬥節奏', description: '攻擊 +9' },
  u_def_small: { title: '強化裝甲', description: '防禦 +4' },
  u_def_medium: { title: '鏡反之盾', description: '防禦 +6' },
  u_crit_small: { title: '掠食視界', description: '爆擊率 +5%' },
  u_crit_medium: { title: '處決絲線', description: '爆擊率 +8%' },
  u_balanced: { title: '老兵本能', description: '攻擊 +4、防禦 +3、最大生命 +20' },
  u_ironwill: { title: '鋼鐵意志', description: '最大生命 +70，攻擊 -3' },
  u_glasscannon: { title: '玻璃大砲', description: '攻擊 +16，防禦 -6' },
  u_lifedrain: { title: '緋紅靜脈', description: '恢復 35 生命，攻擊 +4' },
  u_precision: { title: '精準符紋', description: '攻擊 +4，爆擊率 +4%' },
  u_guardbreak: { title: '攻城紀律', description: '攻擊 +7，防禦 +2' },
  u_evade: { title: '閃避矩陣', description: '防禦 +5，爆擊率 +3%' },
  u_momentum: { title: '動能激湧', description: '攻擊 +11，最大生命 +25' },
  u_focus: { title: '專注晶核', description: '爆擊率 +10%，生命 -10' },
  u_overcharge: { title: '過載核心', description: '攻擊 +13，爆擊率 -5%' },
  u_warding: { title: '守護封印', description: '防禦 +8，最大生命 +18' },
  u_bloodlust: { title: '嗜血印記', description: '攻擊 +12，並恢復 20 生命' },
  u_steelspine: { title: '鋼脊', description: '防禦 +10，攻擊 -5' },
  u_deadeye: { title: '死眼絲線', description: '爆擊率 +6%，攻擊 +6' },
  u_runeforge: { title: '符鑄之心', description: '攻擊 +4、防禦 +4、爆擊率 +4%' },
  u_vigor: { title: '活力血清', description: '最大生命 +32，防禦 +3' },
  u_ambush: { title: '伏擊準則', description: '攻擊 +9，爆擊率 +4%' },
  u_colossus: { title: '巨像引擎', description: '最大生命 +90，防禦 +8' },
  u_hunter: { title: '獵手印章', description: '攻擊 +8，最大生命 +14' },
  u_arcspark: { title: '弧光火花', description: '爆擊率 +12%，防禦 +2' },
  u_endurance: { title: '耐久迴路', description: '最大生命 +40，防禦 +5，攻擊 +4' },
  u_daggerstorm: { title: '匕雨符文', description: '攻擊 +10，爆擊率 +7%，防禦 -3' },
  u_guardheart: { title: '守心節點', description: '防禦 +12，並恢復 26 生命' }
};

export const getUpgradeZh = (id: string, fallbackTitle: string, fallbackDescription: string): UpgradeZhText => {
  return UPGRADE_TEXT_ZH[id] ?? { title: fallbackTitle, description: fallbackDescription };
};
