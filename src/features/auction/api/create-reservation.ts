import axios from "axios";

export const createReservation = async ({
  username,
  user_id,
}: {
  username: string;
  user_id: string;
}) => {
  const reservation = {
    username,
    user_id,
  };

  try {
    const { data } = await axios.post(`/api/reservations`, {
      reservation,
    });

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
