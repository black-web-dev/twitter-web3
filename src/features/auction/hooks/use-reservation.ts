import { useQuery } from "@tanstack/react-query";

import getReservation from "../api/get-reservation";
import { IReservation } from "../types";

export const useReservation = ({
  username,
  initialData,
}: {
  username: string;
  initialData?: IReservation;
}) => {
  return useQuery<IReservation>({
    queryKey: ["reservations", username],
    queryFn: async () => {
      return getReservation(username);
    },
    refetchOnWindowFocus: false,
    initialData: initialData ?? undefined,
  });
};
