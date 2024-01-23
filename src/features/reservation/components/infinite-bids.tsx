"use client";
import { useInView } from "react-intersection-observer";

import { LoadingSpinner } from "@/components/elements/loading-spinner";

import { IInfiniteBidss } from "../types";

import BidItem from "./bid-item";
import styles from "./styles/infinite-bids.module.scss";

export const InfiniteBids = ({
  bids,
  isSuccess,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
}: {
  bids: IInfiniteBidss | undefined;
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
        bids?.pages?.map((page) => {
          return page?.bids?.map((bid, index) =>
            index === page.bids.length - 1 ? (
              <div ref={ref} className={styles.bidContainer} key={bid.id}>
                <BidItem index={index} item={bid} />
              </div>
            ) : (
              <div className={styles.bidContainer} key={bid.id}>
                <BidItem index={index} item={bid} />
              </div>
            ),
          );
        })}

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
};
