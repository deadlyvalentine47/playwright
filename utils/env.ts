import path from 'node:path';
import { config as loadEnv } from 'dotenv';

export const ENV_FILE = process.env.ENV_FILE ?? '.env';

loadEnv({ path: path.resolve(ENV_FILE) });

export class MissingEnvVarError extends Error {
  constructor(name: string) {
    super(
      `Missing required env var ${name} in ${ENV_FILE}.\n` +
        `Copy .env.example to ${ENV_FILE} and fill in every value for that environment.`,
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

/**
 * The typed boundary between untyped environment strings and the rest of the
 * framework. Only values that genuinely differ per environment live here.
 * Read lazily, so running one project does not require the other's config.
 */
export const env = {
  get envFile(): string {
    return ENV_FILE;
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
};
