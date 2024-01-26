"use client";
import { Dispatch } from "react";
import { useInView } from "react-intersection-observer";

import { LoadingSpinner } from "@/components/elements/loading-spinner";

import { IInfiniteReservations } from "../types";

import ReservationItem from "./reservation-item";
import SortHeader from "./sort-header";
import styles from "./styles/infinite-reservations.module.scss";

export const InfiniteReservations = ({
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
  reservations,
  isSuccess,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
}: {
  sortKey: string;
  setSortKey: Dispatch<string>;
  sortDirection: string;
  setSortDirection: Dispatch<"desc" | "asc">;
  reservations: IInfiniteReservations | undefined;
  isSuccess: boolean | undefined;
  isFetchingNextPage: boolean | undefined;
  fetchNextPage: () => Promise<any> | void;
  hasNextPage: boolean | undefined;
}) => {
  const { ref } = useInView({
    onChange: (inView) => {
      inView && hasNextPage && fetchNextPage();
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SortHeader
          label="Username"
          sort={sortKey === "username" ? sortDirection : ""}
          onChange={() => {
            setSortKey("username");
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
          }}
        />
        <SortHeader
          label="Price"
          sort={sortKey === "price" ? sortDirection : ""}
          onChange={() => {
            setSortKey("price");
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
          }}
        />
        <SortHeader
          label="Time remaining"
          sort={sortKey === "time" ? sortDirection : ""}
          onChange={() => {
            setSortKey("time");
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
          }}
        />
        <div></div>
      </div>
      {isSuccess &&
        reservations?.pages?.map((page) => {
          return page?.reservations?.map((reservation, index) =>
            index === page.reservations.length - 1 ? (
              <div
                ref={ref}
                className={styles.reservationContainer}
                key={reservation.id}
              >
                <ReservationItem item={reservation} />
              </div>
            ) : (
              <div className={styles.reservationContainer} key={reservation.id}>
                <ReservationItem item={reservation} />
              </div>
            ),
          );
        })}

      {isSuccess &&
        reservations?.pages &&
        reservations?.pages.length > 0 &&
        reservations?.pages[0].reservations.length === 0 && (
          <div className={styles.noItem}>There is no username.</div>
        )}

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
};
