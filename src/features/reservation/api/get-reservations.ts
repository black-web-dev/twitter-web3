import axios from "axios";
export const getReservations = async ({
  pageParam = "",
  limit = 20,
}: {
  pageParam?: string | unknown;
  limit?: number;
}) => {
  try {
    const { data } = await axios.get(
      `/api/reservations?cursor=${pageParam}&limit=${limit}`,
    );
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
