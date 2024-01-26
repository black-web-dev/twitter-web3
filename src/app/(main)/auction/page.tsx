import React from "react";

import AuctionClientPage from "./client";

export default function AuctionPage() {
  return (
    <section className="container">
      <AuctionClientPage />
    </section>
  );
}

export const metadata = {
  title: "Auction",
};
