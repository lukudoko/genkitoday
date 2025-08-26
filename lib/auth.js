import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Hash the user ID for database storage
function hashUserId(providerId, email) {
  return crypto
    .createHash('sha256')
    .update(providerId + email)
    .digest('hex');
}

// Ensure user exists in database
async function ensureUser(hashedId) {
  try {
    const user = await prisma.user.upsert({
      where: { id: hashedId },
      create: { id: hashedId },
      update: {}, // No updates needed - we pull fresh data from session
    });
    return user;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw error;
  }
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const providerId = profile?.sub || profile?.id;
      if (!providerId) {
        console.error("Provider ID not found in profile:", profile);
        return false;
      }

      try {
        const hashedId = hashUserId(providerId, user.email);
        await ensureUser(hashedId);
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        const providerId = profile?.sub || profile?.id;
        token.hashedId = hashUserId(providerId, user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.hashedId) {
        session.user.hashedId = token.hashedId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};