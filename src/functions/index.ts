import { IUser } from "@/features/profile";

const EXPRIED_DURATION_MONTH = 1; // expired duration is 1 month

export const getAllowedUsername = (user: IUser | undefined) => {
  if (!user) {
    return {
      isAllowed: false,
      expiredDate: new Date(),
      allowedName: "",
    };
  }

  const reservation = user.reservations?.find(
    (item) => item.username === user.screen_name,
  );

  if (!reservation) {
    return {
      isAllowed: false,
      expiredDate: new Date(),
      allowedName: user.name,
    };
  }

  const expiredDate = new Date(reservation.created_at);

  expiredDate.setMonth(expiredDate.getMonth() + EXPRIED_DURATION_MONTH);

  const isAllowed = new Date() < expiredDate;

  return {
    isAllowed,
    expiredDate,
    allowedName: isAllowed ? reservation.username : user.name,
  };
};

export const getAllowedReservation = (date: Date) => {
  const expiredDate = new Date(date);

  expiredDate.setMonth(expiredDate.getMonth() + EXPRIED_DURATION_MONTH);

  const isAllowed = new Date() < expiredDate;

  return { isAllowed, expiredDate };
};
