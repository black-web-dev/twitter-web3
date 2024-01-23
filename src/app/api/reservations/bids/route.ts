import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cursorQuery = searchParams.get("cursor") || undefined;
  const take = Number(searchParams.get("limit")) || 20;

  const skip = cursorQuery ? 1 : 0;
  const cursor = cursorQuery ? { id: cursorQuery } : undefined;

  try {
    const bids = await prisma.reservationBid.findMany({
      skip,
      take,
      cursor,

      include: {
        user: true,
      },

      orderBy: { created_at: "desc" },
    });

    const nextId = bids.length < take ? undefined : bids[bids.length - 1].id;

    return NextResponse.json({
      bids,
      nextId,
    });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { bid } = (await request.json()) as {
    bid: {
      price: string;
      user_id: string;
      reservation_id: string;
    };
  };

  const bidSchema = z
    .object({
      price: z.string(),
      user_id: z.string().cuid(),
      reservation_id: z.string().cuid(),
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
    const exist = await prisma.reservationBid.findMany({
      where: { user_id: bid.user_id, reservation_id: bid.reservation_id },
    });

    if (exist.length > 0)
      return NextResponse.json(
        {
          message: "Bid already exists.",
        },
        { status: 200 },
      );

    const created_bid = await prisma.reservationBid.create({
      data: {
        ...bid,
      },
    });

    return NextResponse.json(created_bid, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      { status: error.errorCode || 500 },
    );
  }
}
