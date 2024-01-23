"use server";

import { prisma } from "@/lib/prisma";

export const getReservationMetadata = async ({
  username,
}: {
  username: string;
}) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        username,
      },

      include: {
        user: true,
        bids: true,
      },
    });

    return reservation;
  } catch (error) {
    console.error(error);
    return null;
  }
};
