import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "../api/buy-follower";
import { IBuyingInfo } from "../types";

export const useGetTransactions = ({
  user_id,
  session_owner_id,
}: {
  user_id: string;
  session_owner_id: string;
}) => {
  return useQuery<IBuyingInfo>({
    queryKey: ["buyinginfo", user_id, session_owner_id],
    queryFn: async () => {
      return getTransactions(user_id, session_owner_id);
    },
    refetchOnWindowFocus: false,
  });
};
