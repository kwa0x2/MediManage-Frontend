"use server";

import { logoutServer } from "@/app/api/services/auth.Service";
import { cookies } from "next/dist/client/components/headers";
import { signOut } from "@/auth";

export const logoutAction = async () => {
  try {
    await logoutServer().then(async (res: any) => {
      if (res.status === 200) {
        cookies().delete("authorization");
        await signOut();

      }
    });
  } catch (error) {
    throw error;
  }
};
