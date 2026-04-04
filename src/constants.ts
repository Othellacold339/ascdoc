import fs from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packageJsonPath = join(__dirname, '../package.json');

let version = '1.0.0';

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version;
} catch (error) {
  // Fallback to 1.0.0 if file read fails at runtime (e.g. non-standard environments)
}

export const VERSION = version;
export const TOOL_NAME = 'ascdoc';
export const TOOL_DESC = '🩺 Release readiness auditor for App Store Connect';
