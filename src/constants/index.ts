import { PublicKey } from '@solana/web3.js';
import { DEFAULT_EXPLORER, FormProps } from 'src/types';

export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
export const JLP_MINT = new PublicKey('27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4');

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
export const SOL_MINT_TOKEN_INFO = {
  chainId: 101,
  address: 'So11111111111111111111111111111111111111112',
  symbol: 'SOL',
  name: 'Wrapped SOL',
  decimals: 9,
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  tags: [],
  extensions: {
    website: 'https://solana.com/',
    serumV3Usdc: '9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT',
    serumV3Usdt: 'HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1',
    coingeckoId: 'solana',
  },
};

export interface IFormConfigurator {
  simulateWalletPassthrough: boolean;
  defaultExplorer: DEFAULT_EXPLORER;
  formProps: FormProps;
}

export const INITIAL_FORM_CONFIG: IFormConfigurator = Object.freeze({
  simulateWalletPassthrough: false,
  defaultExplorer: 'Solana Explorer',
  formProps: {
    fixedInputMint: false,
    fixedOutputMint: false,
    fixedAmount: false,
    initialAmount: '',
    initialInputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    initialOutputMint: WRAPPED_SOL_MINT.toString(),
  },
});

export const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

export const FREEZE_AUTHORITY_LINK =
  'https://station.jup.ag/guides/jupiter-swap/how-swap-works/how-swap-works#freeze-authority';

export const JUPSOL_TOKEN_INFO = {
  address: 'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v',
  chainId: 101,
  name: 'Jupiter Staked SOL',
  symbol: 'JupSOL',
  decimals: 9,
  logoURI: 'https://static.jup.ag/jupSOL/icon.png',
  tags: ['verified', 'community', 'strict', 'lst'],
  freeze_authority: null,
};
