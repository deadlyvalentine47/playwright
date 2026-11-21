import { assertEnvironmentMatches, env } from '../utils/env.js';

/**
 * Runs once before the whole suite. Only the projects actually selected on the
 * command line are checked, so a blogspot-only run does not need bolt config.
 */
export default function globalSetup(): void {
  const projects = (process.env.PLAYWRIGHT_PROJECTS ?? '')
    .split(',')
    .filter(Boolean);

  const selected = projects.length > 0 ? projects : ['blogspot', 'bolt'];

  console.log(`Target environment : ${env.name}`);
  console.log(`Env file loaded    : ${env.envFile}`);

  for (const project of selected) {
    if (project === 'bolt-auth') {
      continue;
    }
    assertEnvironmentMatches(project);
    console.log(`${project.padEnd(18)}: configured`);
  }
}
