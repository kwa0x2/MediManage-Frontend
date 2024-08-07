"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Geçersiz karakter!" };
  }

  const { user_identifier, user_password } = validatedFields.data;

  try {
    await signIn("credentials", {
      user_identifier,
      user_password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Geçersiz hesap bilgileri!" };
        default:
          console.warn("qweqw",error)
          return { error: error.message };
      }
    }
    throw error;
  }
};
