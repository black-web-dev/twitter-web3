import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      username: string;
    };
  },
) {
  const { username } = params;

  const reservationIdSchema = z.string();

  const zod = reservationIdSchema.safeParse(username);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    const reseravtion = await prisma.reservation.findUnique({
      where: {
        username,
      },

      include: {
        user: true,
        bids: true,
      },
    });

    if (!reseravtion) {
      return NextResponse.json(
        {
          message: "Reservation not found",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(reseravtion, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error,
      },
      { status: 500 },
    );
  }
}
