import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/generate-seo.ts'], {
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
