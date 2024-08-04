import { Toaster } from "sonner";
import LoginPage from "./(pages)/(auth)/login/page";

export default function Home() {
  return (
    <>
        <LoginPage/>
        <Toaster richColors />
    </>


  );
}
