import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? 'icetonges@gmail.com';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Passphrase',
      credentials: {
        passphrase: { label: 'Passphrase', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.passphrase === process.env.OWNER_PASSPHRASE) {
          return { id: 'owner', name: 'Peter Shang', email: OWNER_EMAIL };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow owner email
      if (user.email && user.email !== OWNER_EMAIL) return false;
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub ?? '';
        (session.user as { isOwner?: boolean }).isOwner = session.user.email === OWNER_EMAIL;
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
    error: '/login',
  },
  session: { strategy: 'jwt' },
});
