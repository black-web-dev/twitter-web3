import axios from "axios";

export const followUser = async (user_id: string, session_owner_id: string) => {
  try {
    const { data } = await axios.put("/api/users/follow", {
      user_id,
      session_owner_id,
    });

    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const getTransactions = async (
  user_id: string,
  session_owner_id: string,
) => {
  try {
    const params = {
      user_id,
      session_owner_id,
      type: "transaction",
    };
    const { data } = await axios.get(`/api/users/buyFollower`, { params });
    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const buyfollower = async (
  user_id: string,
  session_owner_id: string,
  amount: number,
) => {
  try {
    const { data } = await axios.put("/api/users/buyFollower", {
      user_id,
      session_owner_id,
      amount,
    });

    return data;
  } catch (error: any) {
    return error.message;
  }
};

export const getPackages = async (user_id: string) => {
  try {
    const params = {
      user_id,
      type: "packages",
    };
    const { data } = await axios.get(`/api/users/buyFollowers`, { params });
    return data;
  } catch (error: any) {
    return error.message;
  }
};
