/**
 * Strapi content seed: bootstrap Site Setting and Home Page only (no dummy content).
 * Use after Strapi (cms) is running with the schema applied. For full dummy content, run: npm run strapi-dummy-data
 *
 * Usage (from frontend root): npm run strapi-seed   OR   npx tsx scripts/strapi-seed/run.ts
 * Requires: STRAPI_URL and STRAPI_API_TOKEN. Loads data from frontend/data/site-config.json.
 */
import 'dotenv/config';

import { seedSiteSetting } from './steps/06-site-setting';
import { seedHomePage } from './steps/07-home-page';

async function main(): Promise<void> {
  console.log('Strapi seed (schema bootstrap): starting...\n');

  await seedSiteSetting();
  console.log('');

  await seedHomePage();
  console.log('');

  console.log('Strapi seed: done.');
  console.log('Site Setting and Home Page are set. Run "npm run strapi-dummy-data" to load full dummy content.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
