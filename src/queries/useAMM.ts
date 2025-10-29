import { useQuery } from "@tanstack/react-query";
import { LiteapiClient } from "src/data/LiteService";

export function useAMM() {
  return useQuery({
    queryKey: ['lite','amm'],
    queryFn: () => LiteapiClient.getProgramIdToLabel(),
    select: (data) => {
      return Object.entries(data)
        .map(([key, value]) => ({
          id: key,
          label: value,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
  });
}