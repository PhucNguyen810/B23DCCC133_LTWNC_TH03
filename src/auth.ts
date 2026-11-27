import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { USERS } from './data/users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize(credentials) {
        const user = USERS.find((item) => item.email === credentials.email && item.password === credentials.password);
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role === 'admin' ? 'admin' : 'member';
      return session;
    },
  },
});
