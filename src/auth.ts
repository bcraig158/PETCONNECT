// src/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from '@/lib/db';

const credentialsSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  session: { strategy: 'jwt' }, // JWT strategy for serverless
  providers: [
    Credentials({
      authorize: async (creds) => {
        // Dynamically import argon2 only when needed (not in Edge Runtime)
        // This prevents argon2 from being bundled in middleware (Edge Runtime)
        const argon2 = (await import('argon2')).default;
        
        const parsed = credentialsSchema.safeParse(creds);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;
        const user = await db.user.findUnique({ where: { username } });
        if (!user) return null;

        const ok = await argon2.verify(user.passwordHash, password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.ownerName,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = user.id;
        (token as any).username = (user as any).username;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        (session as any).userId = token.uid;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
});

