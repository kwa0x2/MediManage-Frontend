import Credentials from "@auth/core/providers/credentials";
import NextAuth, { DefaultSession } from "next-auth";
import { cookies } from "next/dist/client/components/headers";
import parse, { splitCookiesString } from "set-cookie-parser";
import { getLoggedInUserServer } from "./app/api/services/auth.Service";
// import { getLoggedInUserServer } from "./app/api/services/authService";

export type ExtendedUser = DefaultSession["user"] & {
  role: any;
  hospital_id: any;
  hospital_name: any;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (token.hospital_id && session.user) {
        session.user.hospital_id = token.hospital_id;
      }
      if (token.hospital_name && session.user) {
        session.user.hospital_name = token.hospital_name;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;


      await getLoggedInUserServer().then(async (value: any) => {
        if (value.error) {
          await signOut();
          console.log("error içine düştü");
          return;
        } else {
          token.role = value.role;
          token.hospital_id = value.hospital_id;
          token.hospital_name = value.hospital_name;
          console.warn("role", token.role);
        }
      });
      return token;
    },
    async signIn({ account, profile }) {
      return true;
    },
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials, request) {
        try {
          console.log("signin", credentials);
          const fetchProps = {
            user_identifier: credentials.user_identifier,
            user_password: credentials.user_password,
          };
          const loginRequest = await fetch(
            `${process.env.BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(fetchProps),
            }
          );

          if (loginRequest.status == 200) {
            const cookieFullString = loginRequest.headers.get("set-cookie");
            if (cookieFullString) {
              console.log("cookie", cookieFullString);
              const splittedCookie = splitCookiesString(cookieFullString);
              const myCookie = parse(splittedCookie);
              console.log("mycookie", myCookie);

              cookies().set({
                name: myCookie[0].name,
                value: myCookie[0].value,
                expires: myCookie[0].expires,
                httpOnly: myCookie[0].httpOnly,
                path: myCookie[0].path,
              });

              const response = await loginRequest.json();
              console.warn("res", response.uuid);
              return {
                name: response.uuid as string,
              };
            }
          }
          return null;
        } catch (error) {
          throw new Error("User authentication error");
        }
      },
    }),
  ],
});
