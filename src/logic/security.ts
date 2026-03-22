const ALLOWED_IMAGE_DATA_PREFIXES = ['data:image/svg+xml', 'data:image/png', 'data:image/jpeg', 'data:image/webp'];

const isAllowedDataImage = (url: string) => {
  const normalized = url.trim().toLowerCase();
  return ALLOWED_IMAGE_DATA_PREFIXES.some((prefix) => normalized.startsWith(prefix));
};

export const sanitizeImageUrl = (url: string, fallback: string): string => {
  if (!url || typeof url !== 'string') return fallback;

  const normalized = url.trim();
  if (normalized.length > 4096) return fallback;

  if (normalized.startsWith('/')) return normalized;
  if (normalized.startsWith(`${import.meta.env.BASE_URL}img/`)) return normalized;
  if (normalized.startsWith('img/')) return normalized;
  if (isAllowedDataImage(normalized)) return normalized;

  return fallback;
};

export const escapeSvgText = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isSecureOwnerMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  const localhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return import.meta.env.DEV && localhost;
};

const CREATOR_UNLOCK_KEY = 'rpg_creator_unlocked_v1';
const CREATOR_PASSWORD_HASH = '97a90922';

const hashPassword = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
};

export const verifyCreatorPassword = (password: string): boolean => {
  if (!password) return false;
  return hashPassword(password) === CREATOR_PASSWORD_HASH;
};

export const isCreatorUnlocked = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(CREATOR_UNLOCK_KEY) === '1';
};

export const setCreatorUnlocked = (value: boolean): void => {
  if (typeof window === 'undefined') return;
  if (value) {
    window.localStorage.setItem(CREATOR_UNLOCK_KEY, '1');
  } else {
    window.localStorage.removeItem(CREATOR_UNLOCK_KEY);
  }
};
