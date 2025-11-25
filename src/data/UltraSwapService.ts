import JSBI from "jsbi";

// --- Aggregator Sources ---

/** A constant map of known decentralized exchange (DEX) aggregators. */
export const AGGREGATOR_SOURCES = {
  METIS: 'metis',
  JUPITERZ: 'jupiterz',
  HASHFLOW: 'hashflow',
  DFLOW: 'dflow',
} as const;

/** Type alias for the possible aggregator source names. */
export type AggregatorSources = (typeof AGGREGATOR_SOURCES)[keyof typeof AGGREGATOR_SOURCES];

// --- API Response Interfaces ---

export interface UltraQuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  priceImpactPct: string;
  /** Detailed plan of how the swap is routed across different AMMs. */
  routePlan: {
    swapInfo: {
      inputMint: string;
      inAmount: string;
      outputMint: string;
      outAmount: string;
      ammKey: string;
      label: string;
      /** Fee amount in raw token units, using JSBI for large integer handling. */
      feeAmount: JSBI; 
      feeMint: string;
    };
    percent: number;
  }[];
  contextSlot: number;
  /** The fully built, ready-to-sign transaction string (base64). */
  transaction: string | null; 
  swapType: 'ultra';
  gasless: boolean;
  requestId: string;
  prioritizationFeeLamports?: number;
  feeBps: number;
  router: AggregatorSources;
}

// Refer docs here https://dev.jup.ag/docs/api/ultra-api/order
export interface UltraSwapQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  taker?: string;
  swapMode?: 'ExactIn' | 'ExactOut';
  referralAccount?: string;
  referralFee?: number;
  excludeDexes?: string[];
  excludeRouters?: string[];
}

interface UltraSwapResponseBase {
  signature: string;
  code: number;
  slot: string;
}

interface UltraSwapResponseSuccess extends UltraSwapResponseBase {
  status: 'Success';
  inputAmountResult: string;
  outputAmountResult: string;
}

interface UltraSwapResponseFailed extends UltraSwapResponseBase {
  status: 'Failed';
  message: string;
  error: string;
}

/** Union type for the final swap execution result. */
export type UltraSwapResponse = UltraSwapResponseSuccess | UltraSwapResponseFailed;

export interface Router {
  icon: string;
  id: AggregatorSources;
  name: string;
}

export type RouterResponse = Router[];

interface TokenBalance {
  amount: string; // Raw token amount as string
  uiAmount: number; // Formatted amount with decimals
  slot: number; // Solana slot number
  isFrozen: boolean; // Whether the token account is frozen
}

export type BalanceResponse = Record<string, TokenBalance>;

export enum Severity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export type Warning = {
  type: string;
  message: string;
  severity: Severity;
};

export interface ShieldResponse {
  warnings: {
    [mintAddress: string]: Warning[];
  };
}

/**
 * Custom error class for API responses that are not 'ok'.
 * Includes the status and attempts to parse the error message from the response body.
 */
class UltraSwapApiError extends Error {
  statusCode: number;
  statusText: string;
  body: unknown;

  constructor(response: Response, body: unknown) {
    // Attempt to extract a message from the JSON body if possible, otherwise use status text
    const message = (body as { error?: string, message?: string })?.error || (body as { error?: string, message?: string })?.message || response.statusText;
    super(`Ultra API Error ${response.status}: ${message}`);
    this.name = 'UltraSwapApiError';
    this.statusCode = response.status;
    this.statusText = response.statusText;
    this.body = body;
  }
}

/**
 * Service class for interacting with the Jupiter Ultra API endpoints.
 * Implements the methods for quoting and submitting swaps.
 */
class UltraSwapService {
  private readonly BASE_URL = 'https://ultra-api.jup.ag';
  
  // Use a map for routes for cleaner access
  private readonly ROUTES = {
    SWAP: `${this.BASE_URL}/execute`,
    ORDER: `${this.BASE_URL}/order`,
    ROUTERS: `${this.BASE_URL}/order/routers`,
    BALANCES: `${this.BASE_URL}/balances`,
    SHIELD: `${this.BASE_URL}/shield`,
  };

  /**
   * Private utility to handle fetch operations and robust error checking.
   */
  private async _fetchAndCheck(url: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Attempt to read the error response body
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }
      throw new UltraSwapApiError(response, errorBody);
    }
    
    return response.json();
  }

  /**
   * Fetches a quote for a swap, including the transaction ready for signing.
   * @param params - The quote parameters (inputMint, outputMint, amount, etc.).
   * @param signal - Optional AbortSignal for request cancellation.
   */
  async getQuote(params: UltraSwapQuoteParams, signal?: AbortSignal): Promise<UltraQuoteResponse> {
    const queryParams = new URLSearchParams();

    // OPTIMIZATION: Loop directly over object keys, filtering out undefined values
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        // Handle array values (like excludeDexes) which URLSearchParams handles automatically,
        // but ensure all non-array values are correctly stringified.
        queryParams.append(key, String(value));
      }
    }

    const url = `${this.ROUTES.ORDER}?${queryParams.toString()}`;
    
    const options: RequestInit = {
      signal,
      headers: {
        'x-client-platform': 'jupiter.plugin' // Required header for identification
      }
    };

    return this._fetchAndCheck(url, options);
  }

  /**
   * Submits a signed swap transaction to the API for execution.
   * @param signedTransaction - The Base64 encoded, signed Solana transaction.
   * @param requestId - The ID received from the quote request.
   */
  async submitSwap(signedTransaction: string, requestId: string): Promise<UltraSwapResponse> {
    const options: RequestInit = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ signedTransaction, requestId }),
    };
    
    return this._fetchAndCheck(this.ROUTES.SWAP, options);
  }
  
  /**
   * Retrieves a list of supported aggregator routers.
   */
  async getRouters(): Promise<RouterResponse> {
    return this._fetchAndCheck(this.ROUTES.ROUTERS);
  }

  /**
   * Retrieves the token balances for a given wallet address.
   * @param address - The wallet public key (base58).
   * @param signal - Optional AbortSignal for request cancellation.
   */
  async getBalance(address: string, signal?: AbortSignal): Promise<BalanceResponse> {
    const options: RequestInit = { signal };
    return this._fetchAndCheck(`${this.ROUTES.BALANCES}/${address}`, options);
  }

  /**
   * Retrieves token safety warnings from the Shield endpoint.
   * @param mintAddress - An array of token mint addresses to check.
   */
  async getShield(mintAddress: string[]): Promise<ShieldResponse> {
    const mintsQuery = mintAddress.join(',');
    const url = `${this.ROUTES.SHIELD}?mints=${mintsQuery}`;
    return this._fetchAndCheck(url);
  }
}

export const ultraSwapService = new UltraSwapService();
