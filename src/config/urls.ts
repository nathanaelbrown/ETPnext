export const CUSTOMER_APP_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_APP_URL ?? 'http://localhost:3002';

export const ADMIN_APP_URL =
  process.env.NEXT_PUBLIC_ADMIN_APP_URL ?? 'http://localhost:3001';

// ✅ keep the legacy object so existing imports keep working
export const APP_URLS = {
  CUSTOMER_APP: CUSTOMER_APP_URL,
  ADMIN_APP: ADMIN_APP_URL,
} as const;

type Query = Record<string, string | number | boolean | null | undefined>;

/** Join base + optional path and append query params safely */
function buildUrl(base: string, path = '', query?: Query) {
  const url = new URL(base);
  if (path) {
    url.pathname = `${url.pathname.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export const toCustomer = (path = '', query?: Query) =>
  buildUrl(CUSTOMER_APP_URL, path, query);

export const toAdmin = (path = '', query?: Query) =>
  buildUrl(ADMIN_APP_URL, path, query);