import React from "react";

import { SortDownIcon } from "../assets/sort-down-icon";
import { SortUpIcon } from "../assets/sort-up-icon";

import styles from "./styles/sort-header.module.scss";

const SortHeader = ({
  label,
  sort,
  onChange,
}: {
  label: string;
  sort?: string;
  onChange: () => void;
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      {label}
      <div className={styles.sort}>
        <div className={`${styles.up} ${sort === "asc" && styles.active}`}>
          <SortUpIcon />
        </div>
        <div className={`${styles.down} ${sort === "desc" && styles.active}`}>
          <SortDownIcon />
        </div>
      </div>
    </div>
  );
};

export default SortHeader;
