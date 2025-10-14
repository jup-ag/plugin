import { keepPreviousData, useQuery } from '@tanstack/react-query';

export type LstApy =Record<string, number>;
export function useLstApyFetcher() {
  return useQuery({
    queryKey: ['lst-apy'],
    queryFn: async () => {
      const lstApy = await fetch(`https://worker.jup.ag/lst-apys-v2`);
      const apyResult: LstApy = await lstApy.json();

      return apyResult;
    },
    retry: 3,
    placeholderData: keepPreviousData,
    staleTime: 300_000, // 5m
  });
}
