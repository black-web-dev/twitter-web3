import Link from "next/link";

import { IBid } from "../types";

import styles from "./styles/bid-item.module.scss";

const BidItem = ({ index, item }: { index: number; item: IBid }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.username}>
          <Link
            className={styles.link}
            href={`/${item.user_id}`}
            aria-label={item.user.name || ""}
            data-title={item.user.email}
          >
            {`${index + 1}. `}
            {item.user.name}
          </Link>
        </div>
        <div className={styles.option}>{`$${item.price}`}</div>
      </div>
      <div className={styles.action}></div>
    </div>
  );
};

export default BidItem;
