import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { getAllowedReservation, getAllowedUsername } from "@/functions";

import { IReservation } from "../types";

import styles from "./styles/reservation-item.module.scss";

const ReservationItem = ({ item }: { item: IReservation }) => {
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { isAllowed, expiredDate } = getAllowedReservation(item.created_at);

  return (
    <div className={styles.container}>
      <Link className={styles.username} href={`/auction/${item.username}`}>
        {item.username}
      </Link>

      <div>{`$${item.price}`}</div>

      {userId === item.user_id && !isAllowed && (
        <div className={styles.badge}>Expired</div>
      )}

      <div>{formatDistanceToNowStrict(expiredDate)}</div>

      <div className={styles.action}>
        <Link className={styles.button} href={`/auction/${item.username}`}>
          Bid
        </Link>
      </div>
    </div>
  );
};

export default ReservationItem;
