import { assertEnvironmentMatches, env } from '../utils/env.js';

/**
 * Runs once before the whole suite. A misconfigured pipeline should fail here,
 * not forty tests in.
 */
export default function globalSetup(): void {
  assertEnvironmentMatches();

  console.log(`Target environment : ${env.name}`);
  console.log(`Env file loaded    : ${env.envFile}`);
  console.log(`Blogspot target    : ${env.blogspotBaseUrl}`);

  try {
    console.log(`Bolt target        : ${env.boltBaseUrl}`);
  } catch {
    console.log('Bolt target        : (not configured for this environment)');
  }
}
