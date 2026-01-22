import { PublicKey } from '@solana/web3.js';
import {
  array,
  bigint,
  boolean,
  coerce,
  defaulted,
  Infer,
  instance,
  nullable,
  number,
  optional,
  string,
  type,
} from 'superstruct';

const PublicKeyFromString = coerce(instance(PublicKey), string(), (value) => new PublicKey(value));

const AmountFromString = coerce<bigint, null, string>(bigint(), string(), (value) => BigInt(value));

const NumberFromString = coerce<string, null, number>(string(), number(), (value) => Number(value));

const SwapInfo = type({
  ammKey: PublicKeyFromString,
  label: string(),
  inputMint: string(),
  outputMint: string(),
  inAmount: AmountFromString,
  outAmount: AmountFromString,
});

const RoutePlanStep = type({
  swapInfo: SwapInfo,
  percent: number(),
});
const RoutePlanWithMetadata = array(RoutePlanStep);

const PlatformFee = type({
  feeBps:number(),
});

export const FormattedUltraQuoteResponse = type({
  inputMint: PublicKeyFromString,
  inAmount: AmountFromString,
  outputMint: PublicKeyFromString,
  outAmount: AmountFromString,
  otherAmountThreshold: AmountFromString,
  priceImpactPct: NumberFromString,
  routePlan: RoutePlanWithMetadata,
  slippageBps: number(),
  contextSlot: defaulted(number(), 0),
  computedAutoSlippage: optional(number()),
  transaction: nullable(string()),
  swapType: string(),
  gasless: boolean(),
  requestId: string(),
  prioritizationFeeLamports: optional(number()),
  prioritizationFeePayer: nullable(PublicKeyFromString),
  rentFeeLamports: optional(number()),
  rentFeePayer: nullable(PublicKeyFromString),
  signatureFeeLamports: optional(number()),
  signatureFeePayer: nullable(PublicKeyFromString),
  feeBps: number(),
  router: string(),
  errorMessage: optional(string()),
  platformFee: PlatformFee,
});

export type FormattedUltraQuoteResponse = Infer<typeof FormattedUltraQuoteResponse>;
