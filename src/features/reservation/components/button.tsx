"use client";

import styles from "./styles/button.module.scss";

export const Button = ({
  text = "reserve",
  isLoading,
  onClick,
}: {
  text?: string;
  isLoading?: boolean;
  onClick: () => void;
}) => {
  return (
    <>
      <button
        className={styles.container}
        aria-label="Reserve"
        data-title="Reserve"
        disabled={isLoading}
        onClick={() => onClick()}
      >
        <span className={styles.text}>{isLoading ? "loading" : text}</span>
      </button>
    </>
  );
};
