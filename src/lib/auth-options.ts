import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

import { getAllowedUsername } from "@/functions";
import { prisma } from "@/lib/prisma";

import {
  credentials,
  crypto,
  discord,
  github,
  google,
  twitter,
} from "./auth-providers";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn(params) {
      const { account, user, profile } = params;

      if (account && account.provider === "crypto") {
        return true;
      }

      const currentSession = await getServerSession(authOptions);

      const currentUserId = currentSession?.user.id as string;

      if (user.email && account && currentUserId) {
        // Fetch the user with this email
        const existingUser = await prisma.user.findUnique({
          where: { id: currentUserId },
        });

        // If the user exists update their discord_email
        if (existingUser?.id) {
          const currentUser: any = user;

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              ...user,
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              screen_name: existingUser.screen_name || currentUser.screen_name,
              image: existingUser.image || currentUser.image,
              profile_image_url:
                existingUser.profile_image_url || currentUser.profile_image_url,
              profile_banner_url:
                existingUser.profile_banner_url ||
                currentUser.profile_banner_url,
            },
          });

          return "/";
        }
      }

      if (account && profile && account.provider === "discord") {
        const discordEmail = profile.email;
        // find user with discordEmail in the DB
        const existingUser = await prisma.user.findFirst({
          where: {
            discord_email: discordEmail,
          },
        });

        // if discordEmail is not same with normal email, use normal user
        if (existingUser) {
          user.email = existingUser.email;
        }
      }

      if (account && profile && account.provider === "twitter") {
        const twitterEmail = profile.email;
        // find user with twitterEmail in the DB
        const existingUser = await prisma.user.findFirst({
          where: {
            twitter_email: twitterEmail,
          },
        });

        // if twitterEmail is not same with normal email, use normal user
        if (existingUser) {
          user.email = existingUser.email;
        }
      }

      if (account && profile && account.provider === "google") {
        const googleEmail = profile.email;
        // find user with googleEmail in the DB
        const existingUser = await prisma.user.findFirst({
          where: {
            google_email: googleEmail,
          },
        });

        // if googleEmail is not same with normal email, use normal user
        if (existingUser) {
          user.email = existingUser.email;
        }
      }

      const isAllowedToSignIn = true;

      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token?.id;
        session.user.name = token?.name;
        session.user.screen_name = token?.screen_name;
        session.user.email = token?.email;
        session.user.role = token?.role;
        session.user.username = token?.screen_name;
        session.user.provider = token?.provider;
        session.user.evm_address = token?.evm_address;
        session.user.profile_image_url = token?.profile_image_url;
      }

      return session;
    },

    async jwt({ token, account }) {
      const dbUser: any = await prisma.user.findFirst({
        where: { email: token?.email },

        include: {
          reservations: true,
        },
      });

      if (!dbUser) {
        return token;
      }

      const provider = account?.provider || token?.provider;

      const { allowedName } = getAllowedUsername(dbUser);

      const detail = {
        id: dbUser.id,
        name: dbUser.name,
        screen_name: allowedName,
        email: dbUser.email,
        role: dbUser.role,
        username: allowedName,
        provider: account?.provider || token?.provider,
        evm_address: dbUser.evm_address,
        profile_image_url: dbUser.profile_image_url,
      };

      switch (provider) {
        case "google":
          return {
            ...detail,
            email: dbUser.google_email,
            username: dbUser.google_username,
          };
        case "discord":
          return {
            ...detail,
            email: dbUser.discord_email,
            username: dbUser.discord_username,
          };
        case "twitter":
          return {
            ...detail,
            email: dbUser.twitter_email,
            username: dbUser.twitter_username,
          };
        default:
          return detail;
      }
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    // error: "/auth/signin",
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider(google),
    GithubProvider(github),
    TwitterProvider(twitter),
    DiscordProvider(discord),
    CredentialsProvider(crypto),
    CredentialsProvider(credentials),
  ],
};
