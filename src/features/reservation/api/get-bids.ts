import axios from "axios";
export const getBids = async ({
  pageParam = "",
  limit = 20,
}: {
  pageParam?: string | unknown;
  limit?: number;
}) => {
  try {
    const { data } = await axios.get(
      `/api/reservations/bids?cursor=${pageParam}&limit=${limit}`,
    );
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
