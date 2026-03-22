export const createSeededRng = (initialSeed: number) => {
  let seed = initialSeed % 2147483647;
  if (seed <= 0) {
    seed += 2147483646;
  }

  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(Math.round(value));

export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const rarityClass = (rarity: 'common' | 'rare' | 'epic'): string => {
  if (rarity === 'epic') {
    return 'border-amber-300/70 bg-amber-500/10';
  }

  if (rarity === 'rare') {
    return 'border-cyan-300/70 bg-cyan-500/10';
  }

  return 'border-slate-400/50 bg-slate-500/10';
};
