"use client";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Modal } from "@/components/elements/modal";
import { useJoinTwitter } from "@/features/auth";

import { BuyfollowersModal } from "./buy-followers-modal";
import styles from "./styles/buy-followers-button.module.scss";

export const BuyFollowersButton = ({
  session_owner_id,
}: {
  session_owner_id: string;
}) => {
  const { data: session } = useSession();

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonText = "Buying followers";

  const handleBuyFollower = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!session) {
      setJoinTwitterData({
        isModalOpen: true,
        action: "buy",
        user: "",
      });
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <button
        aria-label={`${buttonText}`}
        aria-describedby="follow-button-description"
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          handleBuyFollower(e);
        }}
        className={styles.buy}
      >
        {buttonText}
      </button>

      <div
        id="follow-button-description"
        className="visually-hidden"
      >{`Click to buy followers`}</div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            disableScroll={true}
            background="var(--clr-modal-background)"
            closeOnBackdropClick={true}
          >
            <BuyfollowersModal
              session_owner_id={session_owner_id}
              setIsModalOpen={setIsModalOpen}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
