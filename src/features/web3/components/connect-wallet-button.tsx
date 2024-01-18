"use client";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { Modal } from "@/components/elements/modal";
import { useWalletModal } from "@/stores/use-wallet-modal";

import { shortenString } from "../functions/format";
import useSignVerifyWithCrypto from "../hooks/use-sign-verify";

import AccountDetailModal from "./account-detail-modal";
import styles from "./styles/connect-wallet-button.module.scss";
import { SwitchNetworkButton } from "./switch-network-button";
import { WalletButton } from "./wallet-button";
import { WalletModal } from "./wallet-modal";

export const ConnectWalletButton = ({
  text = "Connect Wallet",
  type,
}: {
  text: string;
  type?: string;
}) => {
  const { address, isConnected } = useAccount();
  const isWalletModalOpen = useWalletModal((state) => state.isWalletModalOpen);
  const openWalletModal = useWalletModal((state) => state.openWalletModal);
  const closeWalletModal = useWalletModal((state) => state.closeWalletModal);

  const { isFetchingNonce, error, isLoading, onSignInWithCrypto } =
    useSignVerifyWithCrypto();

  const handleOpenModal = () => {
    if (address && type === "signin") {
      onSignInWithCrypto({ redirect: true });
    } else {
      openWalletModal();
    }
  };

  useEffect(() => {
    if (isConnected && isWalletModalOpen && type === "signin") {
      closeWalletModal();
      onSignInWithCrypto({ redirect: true });
    }
  }, [
    closeWalletModal,
    isConnected,
    isWalletModalOpen,
    onSignInWithCrypto,
    type,
  ]);

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.wrapper}>
        <WalletButton
          disabled={isLoading || isFetchingNonce}
          isLoading={isLoading || isFetchingNonce}
          onClick={handleOpenModal}
          text={address ? shortenString(address, 8) : text}
        />
        {isConnected && <SwitchNetworkButton />}
      </div>

      <AnimatePresence>
        {isWalletModalOpen && (
          <Modal
            onClose={closeWalletModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            {address && isConnected ? (
              <AccountDetailModal onClose={closeWalletModal} />
            ) : (
              <WalletModal onClose={closeWalletModal} />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
