"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { TryAgain } from "@/components/elements/try-again";

import { useAcceptBid } from "../hooks/use-accept-bid";
import { useCreateBid } from "../hooks/use-create-bid";
import { useReservation } from "../hooks/use-reservation";
import { IBid, IReservation } from "../types";

import { BidPriceDetail, calculateBidPrice } from "./bid-price-detail";
import Bids from "./bids";
import { Button } from "./button";
import styles from "./styles/reservation-detail.module.scss";

const getHighBidFromBids = (bids: IBid[]) => {
  return bids.reduce(
    (max, object) => (max.price > object.price ? max : object),
    bids[0],
  );
};

export const ReservationDetail = ({
  initialReservation,
}: {
  initialReservation: IReservation;
}) => {
  const pathname = usePathname();
  const username = pathname?.split("/")[2];

  const { data: session } = useSession();

  const {
    data: reservation,
    isLoading,
    isError,
  } = useReservation({
    username,
    initialData: initialReservation,
  });

  const { mutate: createBid, isPending: isPendingCreateBid } = useCreateBid();

  const { mutate: acceptBid, isPending: isPendingAcceptBid } = useAcceptBid();

  const highBid = getHighBidFromBids(reservation?.bids || []);

  const HighBidPrice = highBid
    ? highBid.price
    : reservation
      ? reservation.price
      : "0";

  return (
    <div className={styles.container}>
      <div className={styles.title}>Username Reservation Detail</div>

      <div className={styles.detail}>
        {!isLoading && session && reservation ? (
          <>
            <div className={styles.item}>
              <div className={styles.label}>Username</div>
              <div className={styles.value}>
                {reservation?.username || username}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>Owner</div>
              <div className={styles.value}>{reservation.user.name}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>price</div>
              <div className={styles.value}>{`$${HighBidPrice}`}</div>
            </div>

            {reservation.user_id === session.user.id ? (
              <>
                {reservation.bids.length > 0 ? (
                  <>
                    <div className={styles.action}>
                      <div
                        className={styles.price}
                      >{`High price: $${calculateBidPrice(
                        Number(HighBidPrice),
                      )}`}</div>
                      <Button
                        text="Accept"
                        isLoading={isPendingAcceptBid}
                        onClick={() =>
                          acceptBid({
                            id: reservation.id,
                            user_id: session.user.id,
                            receive_id: highBid.user_id,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className={styles.noItem}>There is no bid.</div>
                )}
              </>
            ) : (
              <div className={styles.action}>
                <div className={styles.price}>{`Bid price: $${calculateBidPrice(
                  Number(HighBidPrice),
                )}`}</div>
                <Button
                  text="Place bid"
                  isLoading={isPendingCreateBid}
                  onClick={() =>
                    createBid({
                      price: calculateBidPrice(Number(HighBidPrice)).toString(),
                      user_id: session.user.id,
                      reservation_id: reservation.id,
                    })
                  }
                />
              </div>
            )}
          </>
        ) : isError ? (
          <TryAgain />
        ) : (
          <LoadingSpinner />
        )}
      </div>

      <Bids />

      <div className={styles.bidPriceDetail}>
        <BidPriceDetail />
      </div>
    </div>
  );
};
