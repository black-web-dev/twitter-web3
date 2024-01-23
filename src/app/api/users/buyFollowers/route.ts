import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const initialUserBalance = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || undefined;
  const type = searchParams.get("type") || undefined;

  const transactionIdSchema = z
    .object({
      user_id: z.string().cuid(),
    })
    .strict();

  const zod = transactionIdSchema.safeParse({ user_id });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    if (type === "packages") {
      // Get transactions of user
      const followersTx = await prisma.transaction.findMany({
        where: {
          user_id: user_id,
          description: "Package",
        },
      });

      // Get owner's total packages
      const sumPackages = followersTx.reduce(
        (acc, transaction) => acc + transaction.package,
        0,
      );

      const results = {
        packages: sumPackages,
      };

      return NextResponse.json(results, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { session_owner_id, amount, packages } = (await request.json()) as {
    session_owner_id: string;
    amount: number;
    packages: number;
  };

  const followerIdSchema = z
    .object({
      session_owner_id: z.string().cuid(),
    })
    .strict();

  const zod = followerIdSchema.safeParse({ session_owner_id });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    let buyerBalance = 0;
    let systemBalance = 0;

    // Get the last transaction of the buyer from the database
    const buyerLastTransaction = await prisma.transaction.findFirst({
      where: { user_id: session_owner_id },
      orderBy: { created_at: "desc" },
    });

    // If last transaction of buyer does not exist, initialize balance
    if (buyerLastTransaction) {
      buyerBalance = buyerLastTransaction.balance;
    } else {
      buyerBalance = initialUserBalance;
    }

    // Check if amount is available
    if (buyerBalance < amount) {
      return NextResponse.json(
        {
          message: "Amount of transaction is unavailable.",
        },
        {
          status: 400,
        },
      );
    }

    // Add a buyer transaction
    await processTransaction(
      session_owner_id,
      "",
      buyerBalance - amount,
      -amount,
      packages,
      "Package",
    );

    // Get the last transaction of the system from the database
    const systemTransaction = await prisma.transaction.findFirst({
      where: { user_id: "Cascadia" },
      orderBy: { created_at: "desc" },
    });

    if (systemTransaction) {
      systemBalance = systemTransaction.balance;
    }

    // Add a system transaction
    await processTransaction(
      "Cascadia",
      session_owner_id,
      systemBalance + amount,
      amount,
      packages,
    );

    return NextResponse.json(
      {
        message: "Purchased",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log("error", error.message);
    return NextResponse.json(error.message, { status: 500 });
  }
}

const processTransaction = async (
  buyerId: string,
  followerId: string,
  balance: number,
  amount: number,
  packages: number,
  description = "",
) => {
  const transaction = await prisma.transaction.create({
    data: {
      user_id: buyerId,
      follower_id: followerId,
      balance: balance,
      amount: amount,
      description: description,
      package: packages,
      created_at: new Date(),
    },
  });

  return transaction;
};
