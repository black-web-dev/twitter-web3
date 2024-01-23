import axios from "axios";

export default async function getReservation(username: string | undefined) {
  try {
    const { data } = await axios.get(`/api/reservations/${username}`);
    return data;
  } catch (error: any) {
    console.error(error);
  }
}
