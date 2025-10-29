import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UltraSwapQuoteParams, ultraSwapService } from 'src/data/UltraSwapService';
import { FormattedUltraQuoteResponse } from 'src/entity/FormattedUltraQuoteResponse';
import { create } from 'superstruct';

export const useQuoteQuery = (initialParams: UltraSwapQuoteParams, shouldRefetch: boolean = true) => {
  const { amount } = initialParams;
  return useQuery({
    queryKey: ['quote', initialParams],
    queryFn: async ({ signal }) => {
      if (Number(amount) === 0) {
        return null;
      }
      try {
        let params =initialParams;
        if (params.excludeDexes && params.excludeDexes.length > 0) {
          params ={
            ...initialParams,
            excludeRouters:[
              'okx','dflow','hashflow','jupiterz'
            ]
          }
        }
        const response = await ultraSwapService.getQuote(params, signal);
        const quoteResponse = create(response, FormattedUltraQuoteResponse, 'conver FormattedUltraQuoteResponse Error');
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
