# Jupiter Plugin

Jupiter Plugin is an open-source, lightweight version of Jupiter that provides end-to-end swap functionality you can embed directly into your application.

[![npm version](https://badge.fury.io/js/%40jup-ag%2Fplugin.svg)](https://www.npmjs.com/package/@jup-ag/plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔌 **Seamless Integration** - Embed Jupiter swap directly in your app
- 🎨 **Multiple Display Modes** - Modal, widget, or integrated views
- ⚡ **RPC-less** - No RPC needed, Ultra handles everything
- 💰 **Swap Fees** - Earn referral fees on swaps
- 🎯 **Customizable** - Match your app's look and feel

## Quick Start

### Option 1: Script Tag (Easiest)

```html
<script src="https://plugin.jup.ag/plugin-1.0.13.js" data-preload></script>
<script>
  window.Jupiter.init({
    displayMode: 'modal',
  });
</script>
```

### Option 2: NPM Package

```bash
npm install @jup-ag/plugin
# or
pnpm add @jup-ag/plugin
```

```typescript
import { init } from '@jup-ag/plugin';

init({
  displayMode: 'integrated',
  integratedTargetId: 'jupiter-container',
  formProps: {
    initialInputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    initialOutputMint: 'So11111111111111111111111111111111111111112', // SOL
  },
});
```

## Display Modes

### Modal (Default)
Opens as an overlay modal:
```typescript
window.Jupiter.init({ displayMode: 'modal' });
```

### Integrated
Renders inside a target element:
```typescript
window.Jupiter.init({
  displayMode: 'integrated',
  integratedTargetId: 'your-container-id',
});
```

### Widget
Floating button that expands to swap interface:
```typescript
window.Jupiter.init({
  displayMode: 'widget',
  widgetStyle: {
    position: 'bottom-right',
    size: 'default',
  },
});
```

## Configuration

### Form Props

```typescript
window.Jupiter.init({
  formProps: {
    initialInputMint: 'USDC_MINT_ADDRESS',
    initialOutputMint: 'SOL_MINT_ADDRESS',
    initialAmount: '1000000', // in lamports
    fixedMint: 'MINT_ADDRESS', // lock one side
    fixedAmount: true, // lock the amount
    swapMode: 'ExactIn', // or 'ExactOut'
    referralAccount: 'YOUR_REFERRAL_ACCOUNT',
    referralFee: 50, // basis points (0.5%)
  },
});
```

### Wallet Passthrough

If your app already has a wallet connection:

```typescript
import { useWallet } from '@solana/wallet-adapter-react';

const wallet = useWallet();

window.Jupiter.init({
  enableWalletPassthrough: true,
  passthroughWalletContextState: wallet,
  onRequestConnectWallet: () => {
    // Trigger your wallet modal
  },
});

// Sync wallet state changes
useEffect(() => {
  window.Jupiter.syncProps({ passthroughWalletContextState: wallet });
}, [wallet]);
```

### Callbacks

```typescript
window.Jupiter.init({
  onSuccess: ({ txid, swapResult, quoteResponseMeta }) => {
    console.log('Swap successful:', txid);
  },
  onSwapError: ({ error, quoteResponseMeta }) => {
    console.error('Swap failed:', error);
  },
  onFormUpdate: (form) => {
    console.log('Form updated:', form);
  },
});
```

### Styling

```typescript
window.Jupiter.init({
  containerStyles: { maxWidth: '400px' },
  containerClassName: 'my-custom-class',
});
```

## Playground

Try the interactive playground at **[plugin.jup.ag](https://plugin.jup.ag)** to experiment with all configuration options and generate code snippets.

## Documentation

Full documentation available at **[dev.jup.ag/tool-kits/plugin](https://dev.jup.ag/tool-kits/plugin)**

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build widget
pnpm build-widget
```

Set `NEXT_PUBLIC_IS_PLUGIN_DEV=true` in `.env` for local development.

## Contributing

Contributions welcome! Please read [DEVELOPER_NOTES.md](./DEVELOPER_NOTES.md) for architecture details.

## License

MIT © [Jupiter](https://jup.ag)
