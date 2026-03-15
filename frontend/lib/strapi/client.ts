/**
 * Strapi REST API client for ZdravLife.
 * Use when STRAPI_URL and STRAPI_API_TOKEN are set; otherwise the app uses JSON files.
 */

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export const isStrapiEnabled = Boolean(STRAPI_URL && STRAPI_TOKEN);

export interface StrapiResponse<T> {
  data: T;
  meta?: { pagination?: { page: number; pageCount: number; total: number; pageSize?: number } };
}

export interface StrapiPaginationMeta {
  page: number;
  pageCount: number;
  total: number;
  pageSize?: number;
}

/** Append nested filter object to searchParams e.g. filters[category][slug][$eq]=x */
function appendFilters(searchParams: URLSearchParams, prefix: string, obj: Record<string, unknown>): void {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const param = `${prefix}[${key}]`;
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
      appendFilters(searchParams, param, value as Record<string, unknown>);
    } else {
      searchParams.set(param, String(value));
    }
  });
}

export interface StrapiEntity<T> {
  id: number;
  documentId: string;
  attributes: T;
}

/**
 * GET a collection with optional filters and populate.
 * Example: getCollection('posts', { populate: 'category,tags,author,coverImage', filters: { status: 'published' } })
 */
export async function getCollection<T>(
  collection: string,
  params?: {
    populate?: string | string[];
    filters?: Record<string, unknown>;
    sort?: string | string[];
    pagination?: { page?: number; pageSize?: number };
    publicationState?: 'live' | 'preview';
    /** Set to true to skip cache (e.g. for comments so approvals show immediately) */
    dynamic?: boolean;
  }
): Promise<StrapiEntity<T>[]> {
  if (!isStrapiEnabled) return [];

  const searchParams = new URLSearchParams();
  // Strapi 5 expects populate[0]=x&populate[1]=y (invalid: populate=author,category,tags)
  if (params?.populate) {
    const populateList = Array.isArray(params.populate) ? params.populate : params.populate.split(',').map((s) => s.trim());
    populateList.forEach((value, i) => searchParams.set(`populate[${i}]`, value));
  }
  if (params?.sort) {
    searchParams.set('sort', Array.isArray(params.sort) ? params.sort.join(',') : params.sort);
  }
  if (params?.publicationState) {
    searchParams.set('publicationState', params.publicationState);
  }
  if (params?.pagination) {
    if (params.pagination.page) searchParams.set('pagination[page]', String(params.pagination.page));
    if (params.pagination.pageSize) searchParams.set('pagination[pageSize]', String(params.pagination.pageSize));
  }
  if (params?.filters) {
    appendFilters(searchParams, 'filters', params.filters as Record<string, unknown>);
  }

  const url = `${STRAPI_URL}/api/${collection}?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    ...(params?.dynamic ? { cache: 'no-store' as RequestCache } : { next: { revalidate: 60 } }),
  });

  if (!res.ok) {
    console.error(`Strapi ${collection} error:`, res.status, await res.text());
    return [];
  }

  const json = (await res.json()) as StrapiResponse<StrapiEntity<T> | StrapiEntity<T>[]>;
  const data = json.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}

/**
 * GET a collection with pagination meta (for listing pages).
 * Use when you need total/pageCount from Strapi for SEO and UI pagination.
 */
export async function getCollectionWithMeta<T>(
  collection: string,
  params?: {
    populate?: string | string[];
    filters?: Record<string, unknown>;
    sort?: string | string[];
    pagination?: { page?: number; pageSize?: number };
    publicationState?: 'live' | 'preview';
  }
): Promise<{ data: StrapiEntity<T>[]; meta: { pagination: StrapiPaginationMeta } | null }> {
  if (!isStrapiEnabled) return { data: [], meta: null };

  const searchParams = new URLSearchParams();
  if (params?.populate) {
    const populateList = Array.isArray(params.populate) ? params.populate : params.populate.split(',').map((s) => s.trim());
    populateList.forEach((value, i) => searchParams.set(`populate[${i}]`, value));
  }
  if (params?.sort) {
    searchParams.set('sort', Array.isArray(params.sort) ? params.sort.join(',') : params.sort);
  }
  if (params?.publicationState) {
    searchParams.set('publicationState', params.publicationState);
  }
  if (params?.pagination) {
    if (params.pagination.page) searchParams.set('pagination[page]', String(params.pagination.page));
    if (params.pagination.pageSize) searchParams.set('pagination[pageSize]', String(params.pagination.pageSize));
  }
  if (params?.filters) {
    appendFilters(searchParams, 'filters', params.filters as Record<string, unknown>);
  }

  const url = `${STRAPI_URL}/api/${collection}?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error(`Strapi ${collection} error:`, res.status, await res.text());
    return { data: [], meta: null };
  }

  const json = (await res.json()) as StrapiResponse<StrapiEntity<T> | StrapiEntity<T>[]>;
  const data = json.data;
  const list = Array.isArray(data) ? data : data ? [data] : [];
  const meta = json.meta?.pagination
    ? {
        pagination: {
          page: json.meta.pagination.page,
          pageCount: json.meta.pagination.pageCount,
          total: json.meta.pagination.total,
          pageSize: json.meta.pagination.pageSize,
        },
      }
    : null;
  return { data: list, meta };
}

/**
 * GET a single entry by slug.
 */
export async function getBySlug<T>(collection: string, slug: string, populate?: string | string[]): Promise<StrapiEntity<T> | null> {
  if (!isStrapiEnabled) return null;

  const searchParams = new URLSearchParams();
  searchParams.set('filters[slug][$eq]', slug);
  if (populate) {
    const populateList = Array.isArray(populate) ? populate : populate.split(',').map((s) => s.trim());
    populateList.forEach((value, i) => searchParams.set(`populate[${i}]`, value));
  }

  const url = `${STRAPI_URL}/api/${collection}?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const json = (await res.json()) as StrapiResponse<StrapiEntity<T> | StrapiEntity<T>[]>;
  const data = json.data;
  return Array.isArray(data) ? data[0] ?? null : data ?? null;
}

/**
 * GET a single type (e.g. site-setting, home-page).
 */
export async function getSingleType<T>(singleType: string, populate?: string | string[]): Promise<T | null> {
  if (!isStrapiEnabled) return null;

  const searchParams = new URLSearchParams();
  if (populate) {
    const populateList = Array.isArray(populate) ? populate : populate.split(',').map((s) => s.trim());
    populateList.forEach((value, i) => searchParams.set(`populate[${i}]`, value));
  }
  const q = searchParams.toString();
  const url = `${STRAPI_URL}/api/${singleType}${q ? `?${q}` : ''}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const json = (await res.json()) as StrapiResponse<T>;
  return json.data ?? null;
}

/**
 * POST to create an entry (e.g. comment, review).
 * For content types with draftAndPublish, pass status: 'published' so the entry is visible in admin and in list APIs.
 */
export async function createEntry<T>(
  collection: string,
  data: Record<string, unknown>,
  options?: { status?: 'draft' | 'published' }
): Promise<StrapiEntity<T> | null> {
  if (!isStrapiEnabled) return null;

  // Strapi 5: draft/publish can be sent in body and/or query; omit undefined so Strapi doesn't reject
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Record<string, unknown>;
  const body: { data: Record<string, unknown>; status?: string } = { data: cleanData };
  if (options?.status) body.status = options.status;

  const url = `${STRAPI_URL}/api/${collection}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[Strapi] create ${collection} failed: ${res.status} ${url}`, text.slice(0, 500));
    return null;
  }
  const json = (await res.json()) as StrapiResponse<StrapiEntity<T>>;
  return json.data ?? null;
}
