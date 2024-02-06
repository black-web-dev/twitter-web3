import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cursorQuery = searchParams.get("cursor") || undefined;
  const take = Number(searchParams.get("limit")) || 20;
  const sortKey = searchParams.get("sortKey") || "";
  const sortDirection = searchParams.get("sortDirection") || "desc";

  const skip = cursorQuery ? 1 : 0;
  const cursor = cursorQuery ? { id: cursorQuery } : undefined;

  try {
    const reservations = await prisma.reservation.findMany({
      skip,
      take,
      cursor,

      include: {
        user: true,
        bids: true,
      },

      orderBy: {
        ...(sortKey === "username" && {
          username: sortDirection === "desc" ? "desc" : "asc",
        }),

        ...(sortKey === "price" && {
          price: sortDirection === "desc" ? "desc" : "asc",
        }),

        ...(sortKey === "time" && {
          created_at: sortDirection === "desc" ? "desc" : "asc",
        }),

        ...(sortKey === "" && {
          created_at: "desc",
        }),
      },
    });

    const nextId =
      reservations.length < take
        ? undefined
        : reservations[reservations.length - 1].id;

    return NextResponse.json({
      reservations,
      nextId,
    });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { reservation } = (await request.json()) as {
    reservation: {
      username: string;
      user_id: string;
      price: string;
    };
  };

  const reserveSchema = z
    .object({
      username: z.string(),
      user_id: z.string().cuid(),
      price: z.string().nullable().default("0"),
    })
    .strict();

  const zod = reserveSchema.safeParse(reservation);

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
    const exist = await prisma.reservation.findUnique({
      where: { username: reservation.username },
    });

    if (exist)
      return NextResponse.json(
        {
          message: "Username already reserved.",
        },
        { status: 200 },
      );

    const created_reservation = await prisma.reservation.create({
      data: {
        ...reservation,
        price: reservation.price || "0", // set default price from smart contract later
      },
    });

    return NextResponse.json(created_reservation, { status: 200 });
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
