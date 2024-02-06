import axios from "axios";

export const getSearchResults = async (query: string) => {
  try {
    const { data } = await axios.get(`/api/reservations/search?query=${query}`);
    return data;
  } catch (error: any) {
    return error.message;
  }
};
