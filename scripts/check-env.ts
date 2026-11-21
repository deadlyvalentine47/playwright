import { env, MissingEnvVarError } from '../utils/env.js';

/**
 * Fails CI fast and loudly when an environment is not configured.
 * Run before the test step so a missing secret costs 5 seconds, not 20 minutes.
 */
const REQUIRED = ['BLOGSPOT_BASE_URL', 'BOLT_BASE_URL'];

console.log(`Environment file : ${env.envFile}`);

const missing = REQUIRED.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(`\nMissing: ${missing.join(', ')}`);
  console.error(
    `Set these in the pipeline's environment or in ${env.envFile}.\n` +
      'Secrets belong in the pipeline secret store; non-secret values can be committed.',
  );
  process.exit(1);
}

try {
  console.log(`BLOGSPOT_BASE_URL: ${env.blogspotBaseUrl}`);
  console.log(`BOLT_BASE_URL    : ${env.boltBaseUrl}`);
  console.log(`WORKERS / RETRIES: ${env.workers} / ${env.retries}`);
} catch (error) {
  if (error instanceof MissingEnvVarError) {
    console.error(`\n${error.message}`);
    process.exit(1);
  }
  throw error;
}

console.log('\nEnvironment OK');
