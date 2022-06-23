import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma";
import bcrpyt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        student_id: { label: "ID", type: "text", placeholder: "ID" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // retrieve student data from db
        const students = await prisma.student.findMany({
          select: {
            name: true,
            student_id: true,
            password: true,
          },
        });

        // loop through the users
        const isFound = {
          value: false,
          student_id: "",
          name: "",
        };

        // checking with data from db
        students.map((student) => {
          if (
            credentials?.student_id === student.student_id &&
            bcrpyt.compareSync(credentials?.password, student.password!)
          ) {
            (isFound.value = true),
              (isFound.student_id = student.student_id),
              (isFound.name = student.name!);
          }
        });

        if (isFound.value) {
          return {
            student_id: isFound.student_id,
            name: isFound.name,
          };
        }

        // login failed
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.student_id = user.student_id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ token, session }: any) => {
      if (token) {
        session.user.student_id = token.student_id;
        session.user.name = token.name;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
});
