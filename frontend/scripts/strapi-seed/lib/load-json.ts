/**
 * Load JSON data files from the frontend data directory.
 * Run scripts from the frontend root (e.g. npm run strapi-seed) so process.cwd() is frontend/ and data/ resolves to frontend/data/.
 */

import { readFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function loadJson<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export const dataDir = DATA_DIR;
