import type { FullConfig } from '@playwright/test';
import { assertEnvironmentMatches, env } from '../utils/env.js';

/**
 * Runs once before the whole suite. Fails fast when a run is pointed at the
 * wrong environment, so a misconfigured pipeline costs seconds, not a suite.
 *
 * `config.projects` is the list Playwright will actually run, so a blogspot-only
 * run does not demand bolt configuration.
 */
export default function globalSetup(config: FullConfig): void {
  console.log(`Target environment : ${env.name}`);
  console.log(`Env file loaded    : ${env.envFile}`);

  for (const project of config.projects) {
    if (project.name === 'bolt-auth') {
      continue;
    }
    assertEnvironmentMatches(project.name);
    console.log(`${project.name.padEnd(18)}: configured`);
  }
}
