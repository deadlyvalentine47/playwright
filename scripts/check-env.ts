import { baseUrlFor, env, EnvironmentMismatchError } from '../utils/env.js';

/**
 * Pre-flight check, run before the suite so a misconfigured pipeline costs
 * seconds instead of a full run.
 *
 *   npx tsx scripts/check-env.ts blogspot
 *   npx tsx scripts/check-env.ts bolt
 *
 * Each CI job validates only the project it runs, so a job that deliberately
 * omits another project's variable is not treated as broken.
 */

// process.argv is [node, scriptPath, ...args]; drop the first two.
const requested = process.argv.slice(2).filter(Boolean);
const projects = requested.length > 0 ? requested : ['blogspot', 'bolt'];

console.log(`Target environment : ${env.name}`);
console.log(`Env file loaded    : ${env.envFile}`);
console.log(`Checking projects  : ${projects.join(', ')}`);

let failed = false;

for (const project of projects) {
  // which variable backs this project's URL
  const variable = project === 'blogspot' ? 'BLOGSPOT_BASE_URL' : 'BOLT_BASE_URL';

  try {
    const url = baseUrlFor(project);

    // tripwire: a "stage" run must not point at a QA host. Only enforced when
    // URL_MUST_CONTAIN_ENV is on, because hostnames do not always carry the env.
    if (env.urlMustContainEnv && !url.toLowerCase().includes(env.name.toLowerCase())) {
      throw new EnvironmentMismatchError(variable, url, env.name);
    }

    console.log(`  ${variable.padEnd(18)}: ${url}`);
  } catch (error) {
    failed = true;
    const reason = (error as Error).message.split('\n')[0];
    console.error(`  ${variable.padEnd(18)}: ${reason}`);
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
