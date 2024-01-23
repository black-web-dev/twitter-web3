"use client";
import styles from "./styles/bid-price-detail.module.scss";

const floorPrices = [25, 40, 55, 70, 85, 100, 150, 200, 300, 350];

export const calculateBidPrice = (floorPrice: number) => {
  let bidPrice;

  if (floorPrice >= 25 && floorPrice < 100) {
    bidPrice = floorPrice + 15;
  } else if (floorPrice >= 100 && floorPrice <= 400) {
    bidPrice = floorPrice + 50;
  } else {
    return "Floor Price is outside the specified range";
  }

  return bidPrice;
};

export const BidPriceDetail = () => {
  return (
    <div className={styles.container}>
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
    </div>
  );
};
