"use client";
import { useSession } from "next-auth/react";

import { Logo } from "@/features/sidebar";

import { SessionOwnerButton } from "./session-owner-button";
import styles from "./styles/header.module.scss";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      {session && <SessionOwnerButton />}
    </div>
  );
};
