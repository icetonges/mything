// lib/auth.ts — NextAuth v5 (Auth.js) config, Google + credentials
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? 'icetonges@gmail.com';
const OWNER_PASSPHRASE = process.env.OWNER_PASSPHRASE ?? '';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        passphrase: { label: 'Passphrase', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.passphrase) return null;
        if (
          credentials.email === OWNER_EMAIL &&
          credentials.passphrase === OWNER_PASSPHRASE &&
          OWNER_PASSPHRASE
        ) {
          return {
            id: 'owner',
            email: OWNER_EMAIL,
            name: 'Peter Shang',
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email === OWNER_EMAIL) return true;
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
});

declare module 'next-auth' {
  interface Session {
    user: { id?: string; email?: string | null; name?: string | null; image?: string | null };
  }
}
