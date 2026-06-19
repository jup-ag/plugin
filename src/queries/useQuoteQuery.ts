import { useQuery } from '@tanstack/react-query';
import { UltraSwapQuoteParams, ultraSwapService } from 'src/data/UltraSwapService';
import { FormattedUltraQuoteResponse } from 'src/entity/FormattedUltraQuoteResponse';
import { create } from 'superstruct';

/**
 * Default routers to exclude when excludeDexes is specified.
 * These are third-party aggregators that may not respect DEX exclusions.
 */
const DEFAULT_EXCLUDED_ROUTERS = ['okx', 'dflow', 'hashflow', 'jupiterz'];

export const useQuoteQuery = (initialParams: UltraSwapQuoteParams, shouldRefetch: boolean = true) => {
  const { amount } = initialParams;
  return useQuery({
    queryKey: ['quote', initialParams],
    queryFn: async ({ signal }) => {
      if (Number(amount) === 0) {
        return null;
      }
      try {
        let params = initialParams;

        // If excludeDexes is specified, also exclude routers that may bypass DEX exclusions
        // Users can override this by explicitly providing excludeRouters
        if (params.excludeDexes && params.excludeDexes.length > 0 && !params.excludeRouters) {
          params = {
            ...initialParams,
            excludeRouters: DEFAULT_EXCLUDED_ROUTERS,
          };
        }

        const response = await ultraSwapService.getQuote(params, signal);
        const quoteResponse = create(response, FormattedUltraQuoteResponse, 'convert FormattedUltraQuoteResponse Error');
        return {
          quoteResponse,
          original: response,
        };
      } catch (e) {
        if (e instanceof Response) {
          const errorObj = await e.json();
          throw errorObj.error;
        }
        throw e;
      }
    },
    refetchInterval: shouldRefetch ? 5_000 : false,
    retry: 0,
    enabled: Number(amount) > 0,
    gcTime: 0,
    staleTime: 0,
  });
};
