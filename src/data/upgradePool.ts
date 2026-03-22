import { Player, UpgradeCatalogItem, UpgradeOption, UpgradeOptionMetadata } from '../types/game';

const clampCrit = (value: number) => Math.min(0.85, Math.max(0.05, value));

const withStats = (player: Player, patch: Partial<Player>): Player => ({
  ...player,
  ...patch
});

export const UPGRADE_CATALOG: UpgradeCatalogItem[] = [
  {
    id: 'u_hp_small',
    title: 'Vital Core',
    description: '+28 Max HP and heal 20 HP',
    rarity: 'common',
    icon: 'HP+',
    apply: (player) => {
      const maxHp = player.maxHp + 28;
      return withStats(player, { maxHp, hp: Math.min(maxHp, player.hp + 20) });
    },
    tags: ['survive']
  },
  {
    id: 'u_hp_large',
    title: 'Titan Blood',
    description: '+50 Max HP and heal 35 HP',
    rarity: 'rare',
    icon: 'HP++',
    apply: (player) => {
      const maxHp = player.maxHp + 50;
      return withStats(player, { maxHp, hp: Math.min(maxHp, player.hp + 35) });
    },
    tags: ['survive']
  },
  {
    id: 'u_atk_small',
    title: 'Sharpened Edge',
    description: '+6 Attack',
    rarity: 'common',
    icon: 'ATK+',
    apply: (player) => withStats(player, { atk: player.atk + 6 }),
    tags: ['damage']
  },
  {
    id: 'u_atk_medium',
    title: 'Battle Rhythm',
    description: '+9 Attack',
    rarity: 'rare',
    icon: 'ATK++',
    apply: (player) => withStats(player, { atk: player.atk + 9 }),
    tags: ['damage']
  },
  {
    id: 'u_def_small',
    title: 'Fortified Plating',
    description: '+4 Defense',
    rarity: 'common',
    icon: 'DEF+',
    apply: (player) => withStats(player, { def: player.def + 4 }),
    tags: ['survive']
  },
  {
    id: 'u_def_medium',
    title: 'Mirror Guard',
    description: '+6 Defense',
    rarity: 'rare',
    icon: 'DEF++',
    apply: (player) => withStats(player, { def: player.def + 6 }),
    tags: ['survive']
  },
  {
    id: 'u_crit_small',
    title: 'Predator Sight',
    description: '+5% Crit chance',
    rarity: 'common',
    icon: 'CRT+',
    apply: (player) => withStats(player, { crit: clampCrit(player.crit + 0.05) }),
    tags: ['crit']
  },
  {
    id: 'u_crit_medium',
    title: 'Execution Thread',
    description: '+8% Crit chance',
    rarity: 'rare',
    icon: 'CRT++',
    apply: (player) => withStats(player, { crit: clampCrit(player.crit + 0.08) }),
    tags: ['crit']
  },
  {
    id: 'u_balanced',
    title: 'Veteran Instinct',
    description: '+4 ATK / +3 DEF / +20 HP',
    rarity: 'rare',
    icon: 'ALL+',
    apply: (player) => {
      const maxHp = player.maxHp + 20;
      return withStats(player, {
        atk: player.atk + 4,
        def: player.def + 3,
        maxHp,
        hp: Math.min(maxHp, player.hp + 12)
      });
    },
    tags: ['damage', 'survive']
  },
  {
    id: 'u_ironwill',
    title: 'Iron Will',
    description: '+70 HP, -3 ATK',
    rarity: 'epic',
    icon: 'BULWARK',
    apply: (player) => {
      const maxHp = player.maxHp + 70;
      return withStats(player, {
        maxHp,
        hp: Math.min(maxHp, player.hp + 55),
        atk: Math.max(1, player.atk - 3)
      });
    },
    tags: ['survive']
  },
  {
    id: 'u_glasscannon',
    title: 'Glass Cannon',
    description: '+16 ATK, -6 DEF',
    rarity: 'epic',
    icon: 'RISK',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 16,
        def: Math.max(0, player.def - 6)
      }),
    tags: ['damage']
  },
  {
    id: 'u_lifedrain',
    title: 'Crimson Vein',
    description: 'Heal 35 HP and +4 ATK',
    rarity: 'rare',
    icon: 'DRAIN',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 4,
        hp: Math.min(player.maxHp, player.hp + 35)
      }),
    tags: ['damage', 'survive']
  },
  {
    id: 'u_precision',
    title: 'Precision Rune',
    description: '+4 ATK, +4% Crit',
    rarity: 'common',
    icon: 'PRC',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 4,
        crit: clampCrit(player.crit + 0.04)
      }),
    tags: ['damage', 'crit']
  },
  {
    id: 'u_guardbreak',
    title: 'Siege Discipline',
    description: '+7 ATK, +2 DEF',
    rarity: 'rare',
    icon: 'SGE',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 7,
        def: player.def + 2
      }),
    tags: ['damage']
  },
  {
    id: 'u_evade',
    title: 'Evasion Matrix',
    description: '+5 DEF, +3% Crit',
    rarity: 'common',
    icon: 'EVA',
    apply: (player) =>
      withStats(player, {
        def: player.def + 5,
        crit: clampCrit(player.crit + 0.03)
      }),
    tags: ['survive', 'crit']
  },
  {
    id: 'u_momentum',
    title: 'Momentum Surge',
    description: '+11 ATK, +25 HP',
    rarity: 'epic',
    icon: 'MOM',
    apply: (player) => {
      const maxHp = player.maxHp + 25;
      return withStats(player, {
        atk: player.atk + 11,
        maxHp,
        hp: Math.min(maxHp, player.hp + 15)
      });
    },
    tags: ['damage']
  },
  {
    id: 'u_focus',
    title: 'Focus Crystal',
    description: '+10% Crit, -10 HP',
    rarity: 'rare',
    icon: 'FOC',
    apply: (player) =>
      withStats(player, {
        crit: clampCrit(player.crit + 0.1),
        hp: Math.max(1, player.hp - 10)
      }),
    tags: ['crit']
  },
  {
    id: 'u_overcharge',
    title: 'Overcharge Core',
    description: '+13 ATK, -5% Crit',
    rarity: 'rare',
    icon: 'OVR',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 13,
        crit: clampCrit(player.crit - 0.05)
      }),
    tags: ['damage']
  },
  {
    id: 'u_warding',
    title: 'Warding Seal',
    description: '+8 DEF, +18 HP',
    rarity: 'rare',
    icon: 'WRD',
    apply: (player) => {
      const maxHp = player.maxHp + 18;
      return withStats(player, {
        def: player.def + 8,
        maxHp,
        hp: Math.min(maxHp, player.hp + 12)
      });
    },
    tags: ['survive']
  },
  {
    id: 'u_bloodlust',
    title: 'Bloodlust Sigil',
    description: '+12 ATK and heal 20 HP',
    rarity: 'epic',
    icon: 'BLD',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 12,
        hp: Math.min(player.maxHp, player.hp + 20)
      }),
    tags: ['damage', 'survive']
  },
  {
    id: 'u_steelspine',
    title: 'Steel Spine',
    description: '+10 DEF, -5 ATK',
    rarity: 'rare',
    icon: 'STL',
    apply: (player) =>
      withStats(player, {
        def: player.def + 10,
        atk: Math.max(1, player.atk - 5)
      }),
    tags: ['survive']
  },
  {
    id: 'u_deadeye',
    title: 'Deadeye Thread',
    description: '+6% Crit, +6 ATK',
    rarity: 'rare',
    icon: 'DED',
    apply: (player) =>
      withStats(player, {
        crit: clampCrit(player.crit + 0.06),
        atk: player.atk + 6
      }),
    tags: ['crit', 'damage']
  },
  {
    id: 'u_runeforge',
    title: 'Runeforge Heart',
    description: '+4 ATK / +4 DEF / +4% Crit',
    rarity: 'epic',
    icon: 'RUNE',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 4,
        def: player.def + 4,
        crit: clampCrit(player.crit + 0.04)
      }),
    tags: ['damage', 'survive', 'crit']
  },
  {
    id: 'u_vigor',
    title: 'Vigor Serum',
    description: '+32 HP and +3 DEF',
    rarity: 'common',
    icon: 'VIG',
    apply: (player) => {
      const maxHp = player.maxHp + 32;
      return withStats(player, {
        maxHp,
        def: player.def + 3,
        hp: Math.min(maxHp, player.hp + 18)
      });
    },
    tags: ['survive']
  },
  {
    id: 'u_ambush',
    title: 'Ambush Doctrine',
    description: '+9 ATK and +4% Crit',
    rarity: 'rare',
    icon: 'AMB',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 9,
        crit: clampCrit(player.crit + 0.04)
      }),
    tags: ['damage', 'crit']
  },
  {
    id: 'u_colossus',
    title: 'Colossus Engine',
    description: '+90 HP, +8 DEF',
    rarity: 'epic',
    icon: 'COL',
    apply: (player) => {
      const maxHp = player.maxHp + 90;
      return withStats(player, {
        maxHp,
        def: player.def + 8,
        hp: Math.min(maxHp, player.hp + 70)
      });
    },
    tags: ['survive']
  },
  {
    id: 'u_hunter',
    title: 'Hunter Sigil',
    description: '+8 ATK and +14 HP',
    rarity: 'common',
    icon: 'HNT',
    apply: (player) => {
      const maxHp = player.maxHp + 14;
      return withStats(player, {
        atk: player.atk + 8,
        maxHp,
        hp: Math.min(maxHp, player.hp + 8)
      });
    },
    tags: ['damage']
  },
  {
    id: 'u_arcspark',
    title: 'Arc Spark',
    description: '+12% Crit, +2 DEF',
    rarity: 'epic',
    icon: 'ARC',
    apply: (player) =>
      withStats(player, {
        crit: clampCrit(player.crit + 0.12),
        def: player.def + 2
      }),
    tags: ['crit']
  },
  {
    id: 'u_endurance',
    title: 'Endurance Circuit',
    description: '+40 HP, +5 DEF, +4 ATK',
    rarity: 'epic',
    icon: 'END',
    apply: (player) => {
      const maxHp = player.maxHp + 40;
      return withStats(player, {
        maxHp,
        hp: Math.min(maxHp, player.hp + 30),
        def: player.def + 5,
        atk: player.atk + 4
      });
    },
    tags: ['survive', 'damage']
  },
  {
    id: 'u_daggerstorm',
    title: 'Daggerstorm Rune',
    description: '+10 ATK, +7% Crit, -3 DEF',
    rarity: 'epic',
    icon: 'DGR',
    apply: (player) =>
      withStats(player, {
        atk: player.atk + 10,
        crit: clampCrit(player.crit + 0.07),
        def: Math.max(0, player.def - 3)
      }),
    tags: ['damage', 'crit']
  },
  {
    id: 'u_guardheart',
    title: 'Guardheart Node',
    description: '+12 DEF and heal 26 HP',
    rarity: 'epic',
    icon: 'GHD',
    apply: (player) =>
      withStats(player, {
        def: player.def + 12,
        hp: Math.min(player.maxHp, player.hp + 26)
      }),
    tags: ['survive']
  }
];

const rarityWeight: Record<UpgradeCatalogItem['rarity'], number> = {
  common: 0.65,
  rare: 0.27,
  epic: 0.08
};

const toMeta = (item: Pick<UpgradeOption, 'id' | 'title' | 'description' | 'rarity' | 'icon'>): UpgradeOptionMetadata => ({
  id: item.id,
  title: item.title,
  description: item.description,
  rarity: item.rarity,
  icon: item.icon
});

export const materializeUpgrade = (meta: UpgradeOptionMetadata): UpgradeOption => {
  const source = UPGRADE_CATALOG.find((item) => item.id === meta.id);
  if (!source) {
    throw new Error(`Unknown upgrade id: ${meta.id}`);
  }

  return {
    ...meta,
    apply: source.apply
  };
};

const pickOneByWeight = (pool: UpgradeCatalogItem[], rng: () => number): UpgradeCatalogItem => {
  const totalWeight = pool.reduce((acc, item) => acc + rarityWeight[item.rarity], 0);
  let ticket = rng() * totalWeight;

  for (const item of pool) {
    ticket -= rarityWeight[item.rarity];
    if (ticket <= 0) {
      return item;
    }
  }

  return pool[pool.length - 1];
};

export const createUpgradeOptions = (
  player: Player,
  seedRng: () => number,
  count = 3
): UpgradeOption[] => {
  const candidatePool = [...UPGRADE_CATALOG];

  if (player.hp < player.maxHp * 0.45) {
    candidatePool.push(...UPGRADE_CATALOG.filter((item) => item.tags.includes('survive')));
  }

  if (player.crit > 0.45) {
    candidatePool.push(...UPGRADE_CATALOG.filter((item) => item.tags.includes('crit')));
  }

  const chosen: UpgradeCatalogItem[] = [];

  while (chosen.length < count && candidatePool.length > 0) {
    const selected = pickOneByWeight(candidatePool, seedRng);
    if (!chosen.some((item) => item.id === selected.id)) {
      chosen.push(selected);
    }

    const removeIndex = candidatePool.findIndex((item) => item.id === selected.id);
    if (removeIndex >= 0) {
      candidatePool.splice(removeIndex, 1);
    }
  }

  return chosen.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    rarity: item.rarity,
    icon: item.icon,
    apply: item.apply
  }));
};

export const upgradeOptionsToMetadata = (options: UpgradeOption[]): UpgradeOptionMetadata[] =>
  options.map(toMeta);
