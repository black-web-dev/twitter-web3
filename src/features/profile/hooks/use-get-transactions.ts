import { useQuery } from "@tanstack/react-query";

import { getTransactions, getPackages } from "../api/buy-follower";
import { IBuyingInfo, IPackagesInfo } from "../types";

export const useGetTransactions = ({
  user_id,
  session_owner_id,
}: {
  user_id: string;
  session_owner_id: string;
}) => {
  return useQuery<IBuyingInfo>({
    queryKey: ["transactions", user_id, session_owner_id],
    queryFn: async () => {
      return getTransactions(user_id, session_owner_id);
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetPackages = ({ user_id }: { user_id: string }) => {
  return useQuery<IPackagesInfo>({
    queryKey: ["packages", user_id],
    queryFn: async () => {
      return getPackages(user_id);
    },
    refetchOnWindowFocus: false,
  });
};
