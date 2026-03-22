import { PersistedGameState, RunSummary, STORAGE_KEYS } from '../types/game';

const STATE_VERSION = 3;

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const isValidRunSummary = (input: unknown): input is RunSummary => {
  if (!input || typeof input !== 'object') return false;
  const s = input as RunSummary;
  const validClass = s.classId === 'warrior' || s.classId === 'mage' || s.classId === 'assassin' || s.classId === 'god';

  return (
    validClass &&
    isFiniteNumber(s.highestLevel) &&
    isFiniteNumber(s.bossesDefeated) &&
    isFiniteNumber(s.totalDamageDealt) &&
    isFiniteNumber(s.totalDamageTaken) &&
    typeof s.completedAt === 'string'
  );
};

const isValidStateShape = (input: unknown): input is PersistedGameState => {
  if (!input || typeof input !== 'object') return false;
  const state = input as PersistedGameState;

  if (state.version !== STATE_VERSION) return false;
  if (!state.snapshot || typeof state.snapshot !== 'object') return false;

  const snapshot = state.snapshot;
  if (!snapshot.player || !snapshot.boss) return false;

  const validClass =
    snapshot.player.classId === 'warrior' ||
    snapshot.player.classId === 'mage' ||
    snapshot.player.classId === 'assassin' ||
    snapshot.player.classId === 'god';

  const validPhase = ['classSelection', 'battle', 'reward', 'shop', 'event', 'defeat'].includes(snapshot.phase);

  return (
    validClass &&
    validPhase &&
    isFiniteNumber(snapshot.level) &&
    isFiniteNumber(snapshot.turn) &&
    isFiniteNumber(snapshot.player.hp) &&
    isFiniteNumber(snapshot.player.maxHp) &&
    isFiniteNumber(snapshot.player.atk) &&
    isFiniteNumber(snapshot.player.def) &&
    isFiniteNumber(snapshot.player.crit) &&
    typeof snapshot.player.activeSkillId === 'string' &&
    isFiniteNumber(snapshot.boss.hp) &&
    isFiniteNumber(snapshot.boss.maxHp) &&
    typeof snapshot.boss.name === 'string' &&
    Array.isArray(snapshot.logs)
  );
};

export const saveGameState = (snapshot: PersistedGameState['snapshot']): void => {
  const payload: PersistedGameState = {
    version: STATE_VERSION,
    updatedAt: new Date().toISOString(),
    seed: Date.now(),
    snapshot
  };

  localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(payload));
};

export const loadGameState = (): { snapshot: PersistedGameState['snapshot'] } | null => {
  const raw = localStorage.getItem(STORAGE_KEYS.gameState);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidStateShape(parsed)) {
      localStorage.removeItem(STORAGE_KEYS.gameState);
      return null;
    }

    return { snapshot: parsed.snapshot };
  } catch {
    localStorage.removeItem(STORAGE_KEYS.gameState);
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
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidRunSummary(parsed)) {
      localStorage.removeItem(STORAGE_KEYS.runSummary);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.runSummary);
    return null;
  }
};
