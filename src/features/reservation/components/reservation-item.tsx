import Link from "next/link";
import { useSession } from "next-auth/react";

import { CreateDate } from "@/components/elements/create-date";

import { IReservation } from "../types";

import styles from "./styles/reservation-item.module.scss";

const ReservationItem = ({ item }: { item: IReservation }) => {
  const { data: session } = useSession();

  const userId = session?.user.id;

  const createdDate = new Date(item.created_at);
  createdDate.setDate(createdDate.getDate() + 1); // expired duration is 1 day

  const isAllowed = new Date() > createdDate;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link
          className={styles.username}
          href={`/reservation/${item.username}`}
        >
          {item.username}
        </Link>
        <div className={styles.option}>
          {userId === item.user_id && isAllowed && (
            <div className={styles.badge}>Allowed</div>
          )}
          <CreateDate date={item?.created_at} />
        </div>
      </div>
      <div className={styles.detail}>
        <div className={styles.owner}>
          <div>Created by</div>
          <Link
            className={styles.link}
            href={`/${item.user_id}`}
            aria-label={item.user.email || ""}
            data-title={item.user.name}
          >
            {item.user.email}
          </Link>
        </div>
        <div>{`$${item.price}`}</div>
      </div>
      <div className={styles.action}></div>
    </div>
  );
};

export default ReservationItem;
