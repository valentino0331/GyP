import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { User as NextAuthUser } from "next-auth";

// Extender el tipo de usuario de NextAuth para incluir nuestro rol
interface AppUser extends NextAuthUser {
  role?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    // Credentials Provider para usuarios y administradores
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log("Credenciales incompletas");
          return null;
        }

        try {
          const result = await db.query(
            "SELECT id, name, email, role, password_hash FROM app_users WHERE email = $1",
            [credentials.email.toLowerCase()]
          );

          const dbUser = result.rows[0];

          if (dbUser) {
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              dbUser.password_hash
            );

            if (passwordMatch) {
              return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
              };
            }
          }
        } catch (error) {
          console.error("Error en la autorización:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AppUser).role || "user";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as AppUser).role = token.role as string;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
