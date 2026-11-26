export const SITE_URL = 'https://www.dreamcybersecurity.pk';

/**
 * Generates a normalized, unique, self-referencing canonical URL
 * using https://www.dreamcybersecurity.pk as the preferred domain.
 * Strips leading/trailing slashes and query strings to ensure clean URLs.
 */
export function getCanonicalUrl(path: string = ''): string {
  if (!path) return SITE_URL;
  const withoutQuery = path.split('?')[0].split('#')[0];
  const cleanPath = withoutQuery.replace(/^\/+/, '').replace(/\/+$/, '');
  return cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;
}
