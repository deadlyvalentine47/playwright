import path from 'node:path';
import { config as loadEnv } from 'dotenv';

export const ENV_FILE = process.env.ENV_FILE ?? '.env';

loadEnv({ path: path.resolve(ENV_FILE) });

export class MissingEnvVarError extends Error {
  constructor(name: string) {
    super(
      `Missing required env var ${name} in ${ENV_FILE}.\n` +
        'Locally: copy .env.example and fill it in. In CI: set it on the ' +
        'GitHub Environment selected by the workflow.',
    );
    this.name = 'MissingEnvVarError';
  }
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new MissingEnvVarError(name);
  }
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Env var ${name} must be an integer, got "${raw}"`);
  }
  return parsed;
}

function optionalFlag(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) {
    return fallback;
  }
  return ['1', 'true', 'yes', 'on'].includes(raw);
}

/**
 * Typed boundary between untyped environment strings and the framework.
 *
 * Every value is lazy. Nothing is read when this module loads, so running the
 * blogspot project does not require BOLT_BASE_URL and vice versa. That is what
 * lets a CI job declare only the variables its own suite needs.
 */
export const env = {
  get envFile(): string {
    return ENV_FILE;
  },

  /** Which environment this run targets: local, qa, stage, prod. */
  get name(): string {
    return process.env.APP_ENV?.trim() || 'local';
  },

  get blogspotBaseUrl(): string {
    return required('BLOGSPOT_BASE_URL');
  },

  get boltBaseUrl(): string {
    return required('BOLT_BASE_URL');
  },

  get boltAuthState(): string {
    return process.env.BOLT_AUTH_STATE?.trim() || '.auth/bolt.json';
  },

  get workers(): number {
    return optionalInt('WORKERS', process.env.CI ? 1 : 4);
  },

  get retries(): number {
    return optionalInt('RETRIES', process.env.CI ? 2 : 0);
  },

  /**
   * One line that catches "stage build running QA config": when enabled, every
   * target URL must contain the environment name. Off by default because this
   * repo's demo targets are identical across environments.
   */
  get urlMustContainEnv(): boolean {
    return optionalFlag('URL_MUST_CONTAIN_ENV', false);
  },
};

/** Base URL for a project, resolved at use time rather than config load time. */
export function baseUrlFor(project: string): string {
  switch (project) {
    case 'blogspot':
      return env.blogspotBaseUrl;
    case 'bolt':
    case 'bolt-auth':
      return env.boltBaseUrl;
    default:
      throw new Error(`No base URL configured for project "${project}"`);
  }
}

export class EnvironmentMismatchError extends Error {
  constructor(variable: string, url: string, expectedEnv: string) {
    super(
      `${variable} points at "${url}" but this run targets "${expectedEnv}".\n` +
        'Either the wrong environment config was loaded, or URL_MUST_CONTAIN_ENV is' +
        ' set for a target whose hostname does not include the environment name.',
    );
    this.name = 'EnvironmentMismatchError';
  }
}
