/**
 * Upload a file from public/ to Strapi Media Library and optionally link to an entry.
 * Strapi 5: POST /api/upload with FormData. Use ref/refId/field to attach to content.
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { baseUrl, token } from './client';

/** Path relative to project root, e.g. /images/blog/cover.jpg → public/images/blog/cover.jpg */
export function publicPath(webPath: string): string {
  const relative = webPath.startsWith('/') ? webPath.slice(1) : webPath;
  return path.join(process.cwd(), 'public', relative);
}

export interface UploadEntryOptions {
  /** Content-type UID e.g. api::post.post */
  ref: string;
  /** Entry documentId (Strapi 5) */
  refId: string;
  /** Media field name e.g. coverImage, gallery */
  field: string;
}

/**
 * Upload one file to Strapi. If options.ref/refId/field are set, links the file to that entry.
 * Returns the uploaded file's documentId or null.
 */
export async function uploadFile(
  webPath: string,
  options?: { linkToEntry?: UploadEntryOptions; alternativeText?: string }
): Promise<string | null> {
  const filePath = publicPath(webPath);
  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
  } catch {
    console.warn(`  [upload] File not found: ${filePath} (${webPath})`);
    return null;
  }

  const filename = path.basename(filePath);
  const form = new FormData();
  form.append('files', new Blob([new Uint8Array(buffer)]), filename);

  if (options?.alternativeText) {
    form.append(
      'fileInfo',
      JSON.stringify({ name: filename, alternativeText: options.alternativeText })
    );
  }
  if (options?.linkToEntry) {
    const { ref, refId, field } = options.linkToEntry;
    form.append('ref', ref);
    form.append('refId', refId);
    form.append('field', field);
  }

  const url = `${baseUrl}/api/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do not set Content-Type; FormData sets it with boundary
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn(`  [upload] ${webPath}: ${res.status} ${text}`);
    return null;
  }

  const data = (await res.json()) as unknown;
  // Strapi 5 upload can return array of files or { data: [...] }
  const files = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data;
  if (!Array.isArray(files) || files.length === 0) return null;
  const first = files[0] as { documentId?: string; id?: number };
  return first.documentId ?? (first.id != null ? String(first.id) : null);
}

/**
 * Upload multiple files and link them to the same entry (e.g. gallery).
 * Order is preserved. Returns array of documentIds (null for failed uploads).
 */
export async function uploadFilesAndLink(
  webPaths: string[],
  linkToEntry: UploadEntryOptions
): Promise<(string | null)[]> {
  const ids: (string | null)[] = [];
  for (const webPath of webPaths) {
    const id = await uploadFile(webPath, { linkToEntry });
    ids.push(id);
  }
  return ids;
}
