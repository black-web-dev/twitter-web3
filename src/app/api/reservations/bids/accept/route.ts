import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { bid } = (await request.json()) as {
    bid: {
      id: string;
      user_id: string;
      receive_id: string;
    };
  };

  const bidSchema = z
    .object({
      id: z.string(),
      user_id: z.string().cuid(),
      receive_id: z.string().cuid(),
    })
    .strict();

  const zod = bidSchema.safeParse(bid);

  if (!zod.success) {
    return NextResponse.json(
      {
        message: "Invalid request body",
        error: zod.error.formErrors,
      },
      { status: 400 },
    );
  }

  try {
    const reservation = await prisma.reservation.update({
      where: {
        id: bid.id,
        user_id: bid.user_id,
      },
      data: {
        user_id: bid.receive_id,
      },
    });

    await prisma.reservationBid.deleteMany({
      where: {
        reservation_id: reservation.id,
      },
    });

    return NextResponse.json(reservation, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
