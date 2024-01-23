import { useQuery } from "@tanstack/react-query";

import { getSearchResults } from "../api/get-search-results";
import { IReservation } from "../types";

export const useSearch = (query: string) => {
  return useQuery<{
    reservations: IReservation[];
  }>({
    queryKey: ["search", query],
    queryFn: async () => {
      return getSearchResults(query);
    },
    refetchOnWindowFocus: false,
    enabled: !!query,
  });
};
