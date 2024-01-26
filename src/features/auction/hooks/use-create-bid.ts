import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createBid } from "../api/create-bid";

export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      price,
      user_id,
      reservation_id,
    }: {
      price: string;
      user_id: string;
      reservation_id: string;
    }) => {
      return createBid({
        price,
        user_id,
        reservation_id,
      });
    },

    onSuccess: (res) => {
      if (res.message) {
        toast(res.message);
      } else {
        toast(`Your bid was placed`);
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
