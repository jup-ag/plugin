# Developer Notes

## Quick Start

```bash
pnpm i
pnpm dev
```

## Building

```bash
pnpm build-widget    # Build versioned bundle (plugin-1.0.x.js) to /public/
```

## Local Development

The `.env` file has `NEXT_PUBLIC_IS_PLUGIN_DEV=true` which tells the app to 
load bundles from local `/public/` instead of CDN.

**Workflow:**
```bash
pnpm build-widget   # Build once (creates /public/plugin-1.0.x.js)
pnpm dev            # Homepage loads from localhost, not CDN
# Bump version, rebuild, still works - loads new version from /public/
```

## Vercel Previews

Automatically handled:
- `vercel.json` runs `build-widget` before Next.js build
- `NEXT_PUBLIC_VERCEL_ENV=preview` is set automatically by Vercel
- App detects preview mode and loads from preview URL instead of CDN

**Result:** PR previews always test the new code, no CDN needed.

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
