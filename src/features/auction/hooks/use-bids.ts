"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getBids } from "../api/get-bids";
import { IBid } from "../types";

interface IInfiniteBids {
  nextId: string;
  bids: IBid[];
}

export const useBids = ({ queryKey = ["bids"] }: { queryKey?: string[] }) => {
  return useInfiniteQuery<IInfiniteBids>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: ({ pageParam }) => {
      return getBids({
        pageParam,
        limit: 20,
      });
    },
    initialPageParam: "",

    getNextPageParam: (lastPage) => {
      return lastPage?.nextId;
    },
    refetchOnWindowFocus: false,
  });
};
