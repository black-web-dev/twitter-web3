"use client";
import { useState } from "react";

import styles from "./styles/bid-price-detail.module.scss";

const floorPrices = [0, 25, 40, 55, 70, 85, 100, 150, 200, 300, 350];

export const calculateBidPrice = (floorPrice: number) => {
  let bidPrice;

  if (floorPrice >= 0 && floorPrice < 100) {
    bidPrice = floorPrice + 15;
  } else if (floorPrice >= 100 && floorPrice <= 400) {
    bidPrice = floorPrice + 50;
  } else {
    return "Floor Price is outside the specified range";
  }

  return bidPrice;
};

export const BidPriceDetail = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div
        role="button"
        className={styles.link}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.preventDefault()}
        tabIndex={0}
      >
        View Price Description
      </div>

      {isOpen && (
        <table>
          <thead>
            <tr>
              <th>Floor price</th>
              <th>Bid price</th>
            </tr>
          </thead>
          <tbody>
            {floorPrices.map((floorPrice) => {
              const bidPrice = calculateBidPrice(floorPrice);
              return (
                <tr key={floorPrice}>
                  <td>{floorPrice}</td>
                  <td>{bidPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
