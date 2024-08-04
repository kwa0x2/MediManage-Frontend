import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/home/user-nav";
import { SheetMenu } from "@/components/home/sheet-menu";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 bg-[#0F0F12] z-10 w-full  shadow  dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold text-white">{title}</h1>
        </div>
        
      </div>
    </header>
  );
}
