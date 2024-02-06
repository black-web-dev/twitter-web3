import axios from "axios";
export const getReservations = async ({
  pageParam = "",
  limit = 20,
  sortKey,
  sortDirection,
}: {
  pageParam?: string | unknown;
  limit?: number;
  sortKey: string;
  sortDirection: "desc" | "asc";
}) => {
  try {
    const { data } = await axios.get(
      `/api/reservations?cursor=${pageParam}&limit=${limit}&sortKey=${sortKey}&sortDirection=${sortDirection}`,
    );
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
