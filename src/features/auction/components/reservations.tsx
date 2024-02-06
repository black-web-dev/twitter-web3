"use client";

import { useEffect, useState } from "react";

import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { TryAgain } from "@/components/elements/try-again";

import { useReservations } from "../hooks/use-reservations";

import { InfiniteReservations } from "./infinite-reservations";
import styles from "./styles/reservations.module.scss";

export const Reservations = () => {
  const [sortKey, setSortKey] = useState<string>("time");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const {
    data: reservations,
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useReservations({ sortKey, sortDirection });

  useEffect(() => {
    refetch();
  }, [sortKey, sortDirection, refetch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <TryAgain />;
  }

  return (
    <div className={styles.container}>
      <InfiniteReservations
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        reservations={reservations}
        isSuccess={isSuccess}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};
