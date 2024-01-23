"use client";
import { Header, Reservation } from "@/features/reservation";

import styles from "./styles/reservation.module.scss";

export const ReservationClientPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Reservation />
    </div>
  );
};

export default ReservationClientPage;
