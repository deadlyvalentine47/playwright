import { baseUrlFor, env } from '../utils/env.js';

/**
 * Validates only the projects this run needs.
 *
 *   npx tsx scripts/check-env.ts blogspot
 *   npx tsx scripts/check-env.ts bolt
 *
 * A job declares the variables for its own suite; nothing else is required.
 */
const requested = process.argv.slice(2).filter(Boolean);
const projects = requested.length > 0 ? requested : ['blogspot', 'bolt'];

console.log(`Target environment : ${env.name}`);
console.log(`Env file loaded    : ${env.envFile}`);
console.log(`Checking projects  : ${projects.join(', ')}`);

let failed = false;

for (const project of projects) {
  const variable = project === 'blogspot' ? 'BLOGSPOT_BASE_URL' : 'BOLT_BASE_URL';
  try {
    console.log(`  ${variable.padEnd(18)}: ${baseUrlFor(project)}`);
  } catch (error) {
    failed = true;
    console.error(`  ${variable.padEnd(18)}: MISSING — ${(error as Error).message.split('\n')[0]}`);
  }
}

if (failed) {
  console.error(
    '\nSet the missing values on the GitHub Environment selected by the workflow, ' +
      'or in your local env file.',
  );
  process.exit(1);
}

console.log('\nEnvironment OK');
