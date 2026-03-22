import {
  PersistedGameState,
  RunSummary,
  STORAGE_KEYS,
  UpgradeOption,
  UpgradeOptionMetadata
} from '../types/game';
import { materializeUpgrade } from '../data/upgradePool';

const STATE_VERSION = 1;

export const saveGameState = (
  snapshot: PersistedGameState['snapshot'],
  offeredUpgrades: UpgradeOptionMetadata[]
): void => {
  const payload: PersistedGameState = {
    version: STATE_VERSION,
    updatedAt: new Date().toISOString(),
    seed: Date.now(),
    snapshot,
    offeredUpgrades
  };

  localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(payload));
};

export const loadGameState = (): {
  snapshot: PersistedGameState['snapshot'];
  offeredUpgrades: UpgradeOption[];
} | null => {
  const raw = localStorage.getItem(STORAGE_KEYS.gameState);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedGameState;

    if (parsed.version !== STATE_VERSION || !parsed.snapshot) {
      return null;
    }

    const offeredUpgrades = (parsed.offeredUpgrades ?? []).map((meta) => materializeUpgrade(meta));

    return {
      snapshot: parsed.snapshot,
      offeredUpgrades
    };
  } catch (error) {
    console.error('Failed to parse saved state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  localStorage.removeItem(STORAGE_KEYS.gameState);
};

export const saveRunSummary = (summary: RunSummary): void => {
  localStorage.setItem(STORAGE_KEYS.runSummary, JSON.stringify(summary));
};

export const loadRunSummary = (): RunSummary | null => {
  const raw = localStorage.getItem(STORAGE_KEYS.runSummary);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RunSummary;
  } catch (error) {
    console.error('Failed to parse run summary', error);
    return null;
  }
};
