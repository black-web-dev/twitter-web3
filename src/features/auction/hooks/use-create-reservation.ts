import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createReservation } from "../api/create-reservation";

export const useReserve = ({
  setUsername,
}: {
  setUsername: (username: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      username,
      user_id,
    }: {
      username: string;
      user_id: string;
    }) => {
      return createReservation({
        username,
        user_id,
      });
    },

    onSuccess: (res) => {
      if (res.message) {
        toast(res.message);
      } else {
        toast(`Your username was reserved`);
        queryClient.invalidateQueries({ queryKey: ["reservations"] });
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast("Something went wrong");
    },
    onSettled: () => {
      setUsername("");
    },
  });
};
