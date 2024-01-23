"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getReservations } from "../api/get-reservations";
import { IReservation } from "../types";

interface IInfiniteReservations {
  nextId: string;
  reservations: IReservation[];
}

export const useReservations = ({
  queryKey = ["reservations"],
}: {
  queryKey?: string[];
}) => {
  return useInfiniteQuery<IInfiniteReservations>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: ({ pageParam }) => {
      return getReservations({
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
