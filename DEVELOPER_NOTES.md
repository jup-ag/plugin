# Developer Notes

## Quick Start

```bash
pnpm i
pnpm dev
```

## Building

```bash
# Dev build (stable name: plugin-dev.js) - for local testing
pnpm build-widget:dev

# Production build (versioned: plugin-1.0.x.js) - for publishing
pnpm build-widget
```

## Dev Mode Bundle Loading

When using `pnpm build-widget:dev`:
- Webpack outputs to `plugin-dev.js` instead of `plugin-{version}.js`
- The homepage loads the local build instead of fetching from CDN
- You can bump versions freely without breaking the homepage

**Typical dev workflow:**
```bash
pnpm build-widget:dev   # Build once with stable name
pnpm dev                # Start dev server - homepage works!
# Make changes, bump version, rebuild - still works
```

This solves the "version mismatch" issue where bumping package.json version 
would cause the homepage to try loading files that don't exist on CDN yet.

**Vercel previews:** Automatically detected via `VERCEL_ENV=preview`. 
The `vercel.json` runs `build-widget:dev` before Next.js build, so PR previews 
load the new code from the preview URL instead of CDN.

There's a few point of entry for Plugin, and each has specific reasons:

- https://github.com/jup-ag/plugin/blob/main/src/index.tsx (RenderJupiter)
  - This houses all app-related contexts including wallets, accounts, screens, jupiter hooks
- https://github.com/jup-ag/plugin/blob/main/src/pages/_app.tsx (NextJS)
  - This is our Plugin homepage, and preview link
  - It's also the Playground for templates, toggles, and Codeblocks generation
- https://github.com/jup-ag/plugin/blob/main/src/components/Jupiter.tsx (JupiterApp)
  - This is the actual Jupiter app
- https://github.com/jup-ag/plugin/blob/main/src/library.tsx (Injection script)
  - This is how we inject Jupiter and pass props into Jupiter App

Why the separation?

- Webpack is configured specifically to only build JupiterApp and Injection Script for bundle size reasons
- The separation also allows us to develop/test the app like how an integrator would integrate us
- Components can be used in NextJS preview, and also in JupiterApp
  - If you want to add more features, for e.g bringing features from jup.ag to Plugin, I suggest you start from JupiterApp
  - If you want to add customisability, you need to check Injection script
  - If you want to showcase more features, edit NextJS
