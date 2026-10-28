# Developer Notes

Use the Node version in `.node-version` and the pnpm version in `package.json#packageManager`.

To develop, `pnpm install --frozen-lockfile && pnpm dev`.
To build release assets and update `plugin-v1.js`, run `pnpm build-widget`.
To check that the widget assets match the current sources and lockfile, run `pnpm check-widget`.

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
