import type { Reservation, ReservationBid } from "@prisma/client";

import { IUser } from "@/features/profile";

export interface IReservation extends Reservation {
  user: IUser;
  bids: IBid[];
}

export interface IInfiniteReservations {
  pages: { reservations: IReservation[]; nextId?: string | undefined }[];
  pageParams: any;
}

export interface IBid extends ReservationBid {
  user: IUser;
  reservation: IReservation;
}

export interface IInfiniteBidss {
  pages: { bids: IBid[]; nextId?: string | undefined }[];
  pageParams: any;
}
