"use client";
import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { TryAgain } from "@/components/elements/try-again";

import { useBids } from "../hooks/use-bids";

import { InfiniteBids } from "./infinite-bids";
import styles from "./styles/bids.module.scss";

export const Bids = () => {
  const {
    data: bids,
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useBids({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <TryAgain />;
  }

  return (
    <div className={styles.container}>
      <InfiniteBids
        bids={bids}
        isSuccess={isSuccess}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default Bids;
