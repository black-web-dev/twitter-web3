import axios from "axios";

export const acceptBid = async ({
  id,
  user_id,
  receive_id,
}: {
  id: string;
  user_id: string;
  receive_id: string;
}) => {
  const bid = {
    id,
    user_id,
    receive_id,
  };

  try {
    const { data } = await axios.post(`/api/reservations/bids/accept`, {
      bid,
    });

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
