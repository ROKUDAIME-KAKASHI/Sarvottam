import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { DefaultSession } from "next-auth"

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
      name: "Local Test Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@jain.edu" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Find existing user or create mock user for local testing
        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          // Mock creation for prototyping - assigning SUPERADMIN or STUDENT based on email
          const role = (credentials.email as string).includes('admin') ? 'SUPERADMIN' : 
                       (credentials.email as string).includes('faculty') ? 'FACULTY' : 
                       (credentials.email as string).includes('industry') ? 'INDUSTRY_PARTNER' : 'STUDENT';
          
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: (credentials.email as string).split('@')[0],
              role: role
            }
          });
        }
        
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
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
