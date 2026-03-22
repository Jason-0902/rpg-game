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
