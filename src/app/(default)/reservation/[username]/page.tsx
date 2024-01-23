import { Metadata } from "next";

import {
  Header,
  ReservationDetail,
  getReservationMetadata,
} from "@/features/reservation";

import NotFound from "../../not-found";

import styles from "./styles/reservation-detail.module.scss";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const reservation = await getReservationMetadata({
    username: params.username,
  });

  if (!reservation)
    return {
      title: "Username not found",
    };

  return {
    title: `${reservation?.username}`,
    description: reservation?.username,
  };
}

const ReservationDetailPage = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const reservation = await getReservationMetadata({
    username: params.username,
  });

  if (!reservation) return <NotFound />;

  return (
    <div className={styles.container}>
      <Header />
      <ReservationDetail initialReservation={reservation as any} />
    </div>
  );
};

export default ReservationDetailPage;
