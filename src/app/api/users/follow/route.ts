import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || undefined;
  const type = searchParams.get("type") || undefined;

  const userIdSchema = z.string().cuid().optional();
  const zod = userIdSchema.safeParse(user_id);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    if (type === "followers") {
      const followers = await prisma.follower.findMany({
        where: {
          follower_id: user_id,
        },
      });

      const followed = [];
      for (let idx = 0; idx < followers.length; idx++) {
        const followed_id = followers[idx].followed_id;
        const followedUser = await prisma.user.findUnique({
          where: {
            id: followed_id,
          },

          select: {
            id: true,
            name: true,
            screen_name: true,
            email: true,
            discord_username: true,
            discord_email: true,
            profile_image_url: true,
            profile_banner_url: true,
            reputation_count: true,

            created_at: true,
            description: true,
            detail: true,
            location: true,
            url: true,
            verified: true,
            followers: true,
            following: true,
            reputations: true,

            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        });

        followed.push(followedUser);
      }

      return NextResponse.json(followed, { status: 200 });
    } else if (type === "following") {
      const followers = await prisma.follower.findMany({
        where: {
          followed_id: user_id,
        },
      });

      const followed = [];
      for (let idx = 0; idx < followers.length; idx++) {
        const follower_id = followers[idx].follower_id;
        const followingUser = await prisma.user.findUnique({
          where: {
            id: follower_id,
          },

          select: {
            id: true,
            name: true,
            screen_name: true,
            email: true,
            discord_username: true,
            discord_email: true,
            profile_image_url: true,
            profile_banner_url: true,
            reputation_count: true,

            created_at: true,
            description: true,
            detail: true,
            location: true,
            url: true,
            verified: true,
            followers: true,
            following: true,
            reputations: true,

            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        });

        followed.push(followingUser);
      }

      return NextResponse.json(followed, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { user_id, session_owner_id } = (await request.json()) as {
    user_id: string;
    session_owner_id: string;
  };

  const followerIdSchema = z
    .object({
      user_id: z.string().cuid(),
      session_owner_id: z.string().cuid(),
    })
    .strict();

  const zod = followerIdSchema.safeParse({ user_id, session_owner_id });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    await prisma.follower.create({
      data: {
        follower_id: session_owner_id,
        followed_id: user_id,
      },
    });

    return NextResponse.json(
      {
        message: "Followed",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const user_id = searchParams.get("user_id") || undefined;
  const session_owner_id = searchParams.get("session_owner_id") || undefined;

  const followerIdSchema = z
    .object({
      user_id: z.string().cuid(),
      session_owner_id: z.string().cuid(),
    })
    .strict();

  const zod = followerIdSchema.safeParse({ user_id, session_owner_id });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    const delFollower = await prisma.follower.findFirst({
      where: {
        follower_id: session_owner_id,
        followed_id: user_id,
      },
      orderBy: { created_at: "desc" },
    });

    if (delFollower) {
      await prisma.follower.delete({
        where: {
          id: delFollower.id,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Unfollowed",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
