import path from 'node:path';
import { config as loadEnv } from 'dotenv';

/**
 * Pre-flight check. Run as a pipeline step BEFORE the suite, so a missing
 * variable costs seconds instead of a failed run.
 *
 *   npx tsx scripts/check-env.ts blogspot
 *   npx tsx scripts/check-env.ts bolt
 *
 * This lives outside playwright.config.ts on purpose: the config is re-evaluated
 * inside each worker process, where the selected project is not reliably
 * visible, so a project-scoped check there misfires.
 */

const ENV_FILE = process.env.ENV_FILE ?? '.env';
loadEnv({ path: path.resolve(ENV_FILE), quiet: true });

/** Which variables each project needs. Add a project, add a line. */
const NEEDS: Record<string, string[]> = {
  blogspot: ['BLOGSPOT_BASE_URL'],
  bolt: ['BOLT_BASE_URL'],
  'bolt-auth': ['BOLT_BASE_URL'],
  sauce: ['SAUCE_DEMO_URL'],
};

const requested = process.argv.slice(2).filter(Boolean);
// No argument means "check every project", which is what a local pre-commit run wants.
const projects = requested.length > 0 ? requested : Object.keys(NEEDS);

const required = [...new Set(projects.flatMap((p) => NEEDS[p] ?? []))];

console.log(`Env file loaded   : ${ENV_FILE}`);
console.log(`Checking projects : ${projects.join(', ')}`);

if (required.length === 0) {
  console.error(`Unknown project(s): ${projects.join(', ')}`);
  console.error(`Known: ${Object.keys(NEEDS).join(', ')}`);
  process.exit(1);
}

const missing = required.filter((name) => !process.env[name]?.trim());

for (const name of required) {
  const value = process.env[name]?.trim();
  console.log(`  ${name.padEnd(20)}: ${value ?? 'MISSING'}`);
}

if (missing.length > 0) {
  console.error(`\nMissing: ${missing.join(', ')}`);
  console.error('In CI: set them on the GitHub Environment selected by the workflow.');
  console.error(`Locally: fill them in ${ENV_FILE} (see .env.example).`);
  process.exit(1);
}

console.log('\nEnvironment OK');
