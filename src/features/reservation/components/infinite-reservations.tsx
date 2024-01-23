"use client";
import { useInView } from "react-intersection-observer";

import { LoadingSpinner } from "@/components/elements/loading-spinner";

import { IInfiniteReservations } from "../types";

import ReservationItem from "./reservation-item";
import styles from "./styles/infinite-reservations.module.scss";

export const InfiniteReservations = ({
  reservations,
  isSuccess,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
}: {
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

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
};
