"use client";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

import { EllipsisWrapper } from "@/components/elements/ellipsis-wrapper";
import { Modal } from "@/components/elements/modal";
import { Avatar, UserName, UserScreenName } from "@/features/profile";

import { DiscordLogo } from "../assets/discord-logo";
import { GoogleLogo } from "../assets/google-logo";
import { MetamaskLogo } from "../assets/metamask-logo";
import { TwitterLogo } from "../assets/twitter-logo";

import { SessionOwnerModal } from "./session-owner-modal";
import styles from "./styles/session-owner-button.module.scss";

export const SessionOwnerButton = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        aria-label="Account menu"
        tabIndex={0}
        onClick={openModal}
        className={styles.container}
        data-title="Accounts"
        ref={buttonRef}
      >
        <div className={styles.avatar}>
          <Avatar userImage={session?.user?.profile_image_url} />
        </div>
        <div className={styles.userInfo}>
          <EllipsisWrapper>
            <UserName
              name={session?.user?.screen_name}
              isVerified={session?.user?.verified}
            />
          </EllipsisWrapper>

          <EllipsisWrapper>
            <UserScreenName screenName={session?.user?.email?.split("@")[0]} />
          </EllipsisWrapper>
        </div>
        <div className={styles.options}>
          {session?.user.provider === "google" && <GoogleLogo />}
          {session?.user.provider === "discord" && <DiscordLogo />}
          {session?.user.provider === "twitter" && <TwitterLogo />}
          {session?.user.provider === "crypto" && <MetamaskLogo />}
        </div>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            background="none"
            minViewportWidth={500}
          >
            <SessionOwnerModal
              ref={buttonRef}
              onClose={() => setIsModalOpen(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
