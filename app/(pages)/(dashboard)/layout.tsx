import AdminPanelLayout from "@/components/home/home-layout";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider baseUrl="/login" session={session}>
      <AdminPanelLayout>{children}</AdminPanelLayout>
      <Toaster richColors />
    </SessionProvider>
  );
}
