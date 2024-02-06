"use client";
import React from "react";

import { Auction } from "@/features/auction";

import styles from "./styles/auction.module.scss";

export const AuctionClientPage = () => {
  return (
    <div className={styles.container}>
      <Auction />
    </div>
  );
};

export default AuctionClientPage;
