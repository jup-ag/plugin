# Jupiter Plugin

Jupiter Plugin is an open-sourced, lite version of Jupiter that provides end-to-end swap flow by linking it in your HTML.

Visit our Demo / Playground over at https://plugin.jup.ag

With several templates to get you started, and auto generated code snippets.

## Local Development

If you are running the project locally, you will need to set `NEXT_PUBLIC_IS_PLUGIN_DEV=true` in your `.env` file.

## Styling & Wallet Connection UI

The wallet connection modal in Jupiter Plugin relies on utility CSS classes
(similar to Tailwind CSS) for layout and spacing. If your host application
does not already include these styles, the wallet UI can appear broken or
misaligned.

To avoid this:

- If your app already uses Tailwind CSS, make sure your Tailwind build is
  loaded on the page where you mount the plugin.
- If you are not using Tailwind, ensure your CSS provides equivalent utilities
  for common layout classes such as flex, gap, alignment, spacing, rounded
  corners and button styles (e.g. `flex`, `items-center`, `justify-between`,
  `gap-*`, `px-*`, `py-*`, `rounded-*`, hover states, etc.).

If you see a broken wallet connection UI, first verify that Tailwind (or
equivalent utility styles) is available on the page.
