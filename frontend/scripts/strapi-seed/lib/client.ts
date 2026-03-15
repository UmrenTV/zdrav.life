/**
 * Strapi REST client for migration/seed scripts.
 * Uses STRAPI_URL and STRAPI_API_TOKEN from env.
 */

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !STRAPI_TOKEN) {
  throw new Error('STRAPI_URL and STRAPI_API_TOKEN must be set for seed scripts.');
}

export const baseUrl = STRAPI_URL;
export const token = STRAPI_TOKEN;

export interface StrapiDoc<T = Record<string, unknown>> {
  id?: number;
  documentId?: string;
  attributes?: T;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: { pagination?: { page: number; pageCount: number; total: number } };
}

async function strapiFetch<T>(
  path: string,
  options: { method?: string; body?: string } = {}
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: options.body,
    });
  } catch (err) {
    const cause = err instanceof Error ? err.cause : undefined;
    const code = cause && typeof cause === 'object' && 'code' in cause ? (cause as { code: string }).code : '';
    if (code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to Strapi at ${STRAPI_URL}. Is Strapi running? Start it from the cms directory (e.g. cd ../cms && npm run develop).`
      );
    }
    throw err;
  }
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(
        `Strapi ${path}: 404 Not Found. The content type may not exist yet. ` +
          'Apply the schema from strapi-schema-export/ to your Strapi project (see strapi-schema-export/README.md), then restart Strapi and run the seed again.'
      );
    }
    throw new Error(`Strapi ${path}: ${res.status} ${text}`);
  }
  return res.json() as Promise<StrapiResponse<T>>;
}

/**
 * Build query string for Strapi REST. Only encode values, not bracket keys,
 * so Strapi's qs parser receives filters[slug][$eq]=x (not filters%5Bslug%5D...).
 */
function buildStrapiQuery(params: {
  populate?: string;
  filters?: Record<string, string>;
  pagination?: { page: number; pageSize: number };
  publicationState?: string;
}): string {
  const parts: string[] = [];
  if (params.populate) parts.push(`populate=${encodeURIComponent(params.populate)}`);
  if (params.pagination) {
    parts.push(`pagination[page]=${params.pagination.page}`);
    parts.push(`pagination[pageSize]=${params.pagination.pageSize}`);
  }
  if (params.publicationState) parts.push(`publicationState=${encodeURIComponent(params.publicationState)}`);
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      parts.push(`filters[${key}][$eq]=${encodeURIComponent(value)}`);
    }
  }
  return parts.join('&');
}

/** GET collection with optional filters and populate */
export async function getCollection<T>(
  collection: string,
  params?: {
    populate?: string;
    filters?: Record<string, string>;
    pagination?: { page: number; pageSize: number };
    publicationState?: 'preview' | 'live';
  }
): Promise<StrapiDoc<T>[]> {
  const q = buildStrapiQuery(params ?? {});
  const path = `/api/${collection}${q ? `?${q}` : ''}`;
  const json = await strapiFetch<StrapiDoc<T> | StrapiDoc<T>[]>(path);
  const data = json.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}

/** POST to create a single entry. Returns created document with documentId. */
export async function createEntry<T>(
  collection: string,
  data: Record<string, unknown>,
  options?: { status?: 'draft' | 'published' }
): Promise<StrapiDoc<T>> {
  const path = `/api/${collection}`;
  const body: { data: Record<string, unknown>; status?: string } = { data };
  if (options?.status) body.status = options.status;
  else body.status = 'published'; // seed as published so Blogs/Shop show content without manual publish in admin
  const json = await strapiFetch<StrapiDoc<T>>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!json.data) throw new Error(`Strapi create ${collection}: no data returned`);
  return json.data;
}

/** PUT to update a single type (e.g. site-setting, home-page) */
export async function updateSingleType<T>(
  singleType: string,
  data: Record<string, unknown>
): Promise<StrapiDoc<T>> {
  const path = `/api/${singleType}`;
  const json = await strapiFetch<StrapiDoc<T>>(path, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  if (!json.data) throw new Error(`Strapi update ${singleType}: no data returned`);
  return json.data;
}
