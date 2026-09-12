// Собираем сервер в один self-contained файл: SDK и zod уходят внутрь бандла,
// поэтому `npx promptpilot-mcp` не тянет дерево зависимостей и стартует мгновенно —
// это и лечит CONNECTION_CLOSED по таймауту холодного старта у пользователей.
// Shebang не добавляем баннером: он уже есть в src/index.ts, esbuild его сохраняет.
import { build } from 'esbuild';
import { chmodSync, rmSync } from 'node:fs';

rmSync('build', { recursive: true, force: true });

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'build/index.js',
  logLevel: 'info',
});

chmodSync('build/index.js', 0o755);
console.log('bundle готов: build/index.js');
