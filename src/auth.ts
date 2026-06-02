import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { DefaultSession } from "next-auth"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@jain.edu" },
        password: { label: "Password", type: "password" },
        impersonationToken: { label: "Impersonation Token", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.impersonationToken) {
          const tokenRecord = await prisma.impersonationToken.findUnique({
            where: { id: credentials.impersonationToken as string },
            include: { user: true }
          });
          
          if (!tokenRecord) {
            throw new Error("Invalid impersonation token");
          }

          await prisma.impersonationToken.delete({ where: { id: tokenRecord.id } });

          const isExpired = new Date().getTime() - tokenRecord.createdAt.getTime() > 5 * 60 * 1000;
          if (isExpired) {
            throw new Error("Impersonation token expired");
          }

          return tokenRecord.user;
        }

        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
})
