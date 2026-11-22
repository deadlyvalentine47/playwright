import fs from 'node:fs';
import path from 'node:path';

export function getTestData<T>(jsonFilePath: string): T[] {
  const absolutePath = path.resolve(jsonFilePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Data file not found: ${absolutePath}`);
  }
  const rawData = fs.readFileSync(absolutePath, 'utf-8');
  try {
    const parsed = JSON.parse(rawData) as unknown;
    if (!Array.isArray(parsed)) {
      // single-object data files are wrapped so every call site returns a list
      return [parsed as T];
    }
    return parsed as T[];
  } catch {
    throw new Error(`Invalid JSON in data file: ${absolutePath}`);
  }
}
