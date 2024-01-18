"use client";
import { motion } from "framer-motion";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { CloseIcon } from "@/assets/close-icon";
import { chains } from "@/utils/wagmi-provider";

import { NetworkButton } from "./network-button";
import styles from "./styles/network-modal.module.scss";

export const NetworkModal = ({ onClose }: { onClose: () => void }) => {
  const { chain } = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      role="group"
      className={styles.container}
    >
      <div className={styles.header}>
        <button
          onClick={onClose}
          aria-label="Close"
          data-title="Close"
          className={styles.close}
        >
          <CloseIcon />
        </button>

        <div className={styles.title}>Switch Network</div>

        <div className={styles.placeholder} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          {chains.map((item: any) => (
            <div key={item.id} className={styles.authButtons}>
              <NetworkButton
                isActive={item.id === chain?.id}
                disabled={!switchNetwork || item.id === chain?.id}
                isLoading={isLoading && pendingChainId === item.id}
                onClick={() => switchNetwork?.(item.id)}
                icon={item.iconUrl}
                text={item.name}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
