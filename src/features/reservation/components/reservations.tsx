"use client";

import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { TryAgain } from "@/components/elements/try-again";

import { useReservations } from "../hooks/use-reservations";

import { InfiniteReservations } from "./infinite-reservations";
import { Search } from "./search";
import styles from "./styles/reservations.module.scss";

export const Reservations = () => {
  const {
    data: reservations,
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useReservations({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <TryAgain />;
  }

  return (
    <div className={styles.container}>
      {isSuccess &&
        reservations.pages.length > 0 &&
        reservations.pages[0].reservations.length > 0 && <Search />}
      <InfiniteReservations
        reservations={reservations}
        isSuccess={isSuccess}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};
