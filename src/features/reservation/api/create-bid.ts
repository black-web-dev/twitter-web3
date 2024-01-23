import axios from "axios";

export const createBid = async ({
  price,
  user_id,
  reservation_id,
}: {
  price: string;
  user_id: string;
  reservation_id: string;
}) => {
  const bid = {
    price,
    user_id,
    reservation_id,
  };

  try {
    const { data } = await axios.post(`/api/reservations/bids`, {
      bid,
    });

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
