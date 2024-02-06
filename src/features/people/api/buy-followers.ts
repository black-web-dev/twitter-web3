import axios from "axios";

export const buyfollowers = async (
  session_owner_id: string,
  packages: number,
  amount: number,
) => {
  try {
    const { data } = await axios.put("/api/users/buyFollowers", {
      session_owner_id,
      packages,
      amount,
    });

    return data;
  } catch (error: any) {
    return error.message;
  }
};
