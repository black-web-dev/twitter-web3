"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { forwardRef } from "react";

import { useTrackPosition } from "@/components/elements/modal";

import styles from "./styles/session-owner-modal.module.scss";

export const SessionOwnerModal = forwardRef<
  HTMLButtonElement,
  { onClose: () => void }
>(({ onClose }, ref) => {
  const { data: session } = useSession();

  const buttonBoundaries = useTrackPosition({
    buttonRef: ref as React.RefObject<HTMLButtonElement>,
    trackScroll: false,
  });

  console.log(buttonBoundaries);

  const style: React.CSSProperties = {
    position: "fixed",
    top: buttonBoundaries?.bottom ? buttonBoundaries?.bottom : "50%",
    right: buttonBoundaries?.right
      ? window.innerWidth - buttonBoundaries?.right
      : "50%",
    transform: buttonBoundaries?.bottom
      ? "translate(0, 0)"
      : "translate(50%, 50%)",
  };

  if (!session) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{
        ease: "easeInOut",
        duration: 0.2,
      }}
      className={styles.container}
      style={style}
      role="group"
    >
      <Link href={`/auth/signout`} role="menuitem" onClick={onClose}>
        Log out @{session?.user?.email.split("@")[0]}
      </Link>
    </motion.div>
  );
});

SessionOwnerModal.displayName = "SessionOwnerModal";
