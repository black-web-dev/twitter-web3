import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import { CheckIcon } from "../assets/check-icon";
import { EthereumLogo } from "../assets/ethereum-logo";

import styles from "./styles/network-button.module.scss";

export const NetworkButton = ({
  onClick,
  icon = <EthereumLogo />,
  text,
  disabled,
  isLoading,
  isActive,
}: {
  onClick?: () => void;
  icon?: React.ReactNode;
  text?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.container}
      disabled={disabled || isLoading}
    >
      {text ? (
        <div className={styles.header}>
          {icon} {text}
        </div>
      ) : (
        <div className={styles.icon}>{icon}</div>
      )}
      {isActive && (
        <div className={styles.isActive}>
          <CheckIcon />
        </div>
      )}
      {isLoading && (
        <div className={styles.isLoading}>
          <ButtonLoadingSpinner />
        </div>
      )}
    </button>
  );
};
