## Publishing/Tagging new version

1. Use the exact Node version in `.node-version` and pnpm version in `package.json#packageManager`.
2. Bump the package version when releasing changed widget code or dependencies.
3. Run `pnpm build-widget`. It validates the toolchain, runs `pnpm install --frozen-lockfile --prod=false`, builds without Webpack's cache, and updates the versioned assets plus `public/plugin-v1.js`.
4. Run `pnpm check-widget`. It rebuilds into a temporary directory and fails if any generated asset is missing or differs from `public/`, including the `plugin-v1.js` alias. It does not overwrite public assets.
5. Commit generated assets alongside the source, config, and lockfile changes that produced them. CI runs the same check on every PR and push to `main`.
6. Publish by merging, then clear the Cloudflare cache.

For intentional dependency changes, update and commit `pnpm-lock.yaml` before building. Release builds never regenerate the lockfile. Changes to build inputs require rebuilding the widget, even if the version is unchanged.

`verifyDepsBeforeRun: false` disables pnpm's automatic install before scripts, so it cannot update the lockfile before the release command performs its frozen install.

The GitHub check is named `Verify widget artifacts`. Configure it as a required status check in the `main` branch rules to prevent merging stale bundles.

## Publishing to NPM
- pnpm tsup
- npm publish --access public

# Scoping Tailwind Preflight CSS
- cp node_modules/tailwindcss/lib/css/preflight.css ./preflight.stylus
- Scope entire file with #jupiter-plugin
- npx stylus ./preflight.stylus -o ./public/scoped-preflight.css
- rm ./preflight.stylus
