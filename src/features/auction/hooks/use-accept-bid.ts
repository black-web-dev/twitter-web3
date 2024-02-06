import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { acceptBid } from "../api/accept-bid";

export const useAcceptBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      user_id,
      receive_id,
    }: {
      id: string;
      user_id: string;
      receive_id: string;
    }) => {
      return acceptBid({
        id,
        user_id,
        receive_id,
      });
    },

    onSuccess: (res) => {
      if (res.message) {
        toast(res.message);
      } else {
        toast(`Accepted`);
        queryClient.invalidateQueries({
          queryKey: ["reservations", res.username],
        });
        queryClient.invalidateQueries({ queryKey: ["bids"] });
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast("Something went wrong");
    },
    onSettled: () => {},
  });
};
