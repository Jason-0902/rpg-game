import { PersistedGameState, RunSummary, STORAGE_KEYS } from '../types/game';

const STATE_VERSION = 2;

export const saveGameState = (snapshot: PersistedGameState['snapshot']): void => {
  const payload: PersistedGameState = {
    version: STATE_VERSION,
    updatedAt: new Date().toISOString(),
    seed: Date.now(),
    snapshot,
    offeredUpgrades: []
  };

  localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(payload));
};

export const loadGameState = (): {
  snapshot: PersistedGameState['snapshot'];
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

    return {
      snapshot: parsed.snapshot
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
