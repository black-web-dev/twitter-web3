"use client";
import { AnimatePresence } from "framer-motion";
import { useNetwork } from "wagmi";

import { Modal } from "@/components/elements/modal";
import { useNetworkModal } from "@/stores/use-network-modal";
import { chains } from "@/utils/wagmi-provider";

import { NetworkButton } from "./network-button";
import { NetworkModal } from "./network-modal";
import styles from "./styles/switch-wallet-button.module.scss";

export const SwitchNetworkButton = () => {
  const { chain } = useNetwork();
  const isNetworkModalOpen = useNetworkModal(
    (state) => state.isNetworkModalOpen,
  );
  const openNetworkModal = useNetworkModal((state) => state.openNetworkModal);
  const closeNetworkModal = useNetworkModal((state) => state.closeNetworkModal);

  const IconUrl = chains.find((_chain) => _chain.id === chain?.id)?.iconUrl;

  return (
    <div className={styles.container}>
      <NetworkButton icon={IconUrl} onClick={() => openNetworkModal()} />

      <AnimatePresence>
        {isNetworkModalOpen && (
          <Modal
            onClose={closeNetworkModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <NetworkModal onClose={closeNetworkModal} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
