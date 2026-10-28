const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const packageJson = require('../package.json');
const check = process.argv.length === 3 && process.argv[2] === '--check';
const publicDir = path.join(root, 'public');
// These unused entrypoint files are also excluded by .gitignore.
const ignoredAssets = new Set(['Tailwind.js', 'Tailwind.js.map']);

function pnpm(args, options = {}) {
  return execFileSync('pnpm', args, { cwd: root, stdio: 'inherit', ...options });
}

function main() {
  if (process.argv.length > 2 && !check) {
    throw new Error('Usage: pnpm build-widget or pnpm check-widget');
  }

  // Build-only requirements: do not impose these on consumers of the npm package.
  const nodeVersion = fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim();
  if (process.versions.node !== nodeVersion) {
    throw new Error(`Widget builds require Node ${nodeVersion}; found ${process.versions.node}. See .node-version.`);
  }
  const pnpmVersion = pnpm(['--version'], { encoding: 'utf8', stdio: 'pipe' }).trim();
  if (`pnpm@${pnpmVersion}` !== packageJson.packageManager) {
    throw new Error(`Widget builds require ${packageJson.packageManager}; found pnpm@${pnpmVersion}.`);
  }

  // Sync installed dependencies with the committed lockfile before every build.
  pnpm(['install', '--frozen-lockfile', '--prod=false']);

  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jupiter-widget-'));
  try {
    // Build in isolation so checks and failed builds never overwrite public assets.
    pnpm(['exec', 'webpack', '--no-cache', '--output-path', outputDir], {
      env: { ...process.env, NODE_ENV: 'production', MODE: 'widget', ANALYSE: 'false' },
    });
    fs.copyFileSync(path.join(outputDir, `plugin-${packageJson.version}.js`), path.join(outputDir, 'plugin-v1.js'));

    const files = fs
      .readdirSync(outputDir, { recursive: true })
      .filter((file) => !ignoredAssets.has(file) && fs.statSync(path.join(outputDir, file)).isFile())
      .sort();

    if (check) {
      const different = files.filter((file) => {
        const current = path.join(publicDir, file);
        return !fs.existsSync(current) || !fs.readFileSync(current).equals(fs.readFileSync(path.join(outputDir, file)));
      });
      if (different.length) {
        throw new Error(
          `Widget assets are missing or out of date:\n${different.map((file) => `  public/${file}`).join('\n')}\n` +
            'Run pnpm build-widget and commit the generated assets with the source/config/lockfile changes.',
        );
      }
      console.log(`Verified ${files.length} widget assets, including plugin-v1.js.`);
    } else {
      for (const file of files) {
        const destination = path.join(publicDir, file);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(path.join(outputDir, file), destination);
      }
      console.log(`Updated ${files.length} widget assets, including plugin-v1.js.`);
    }
  } finally {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
