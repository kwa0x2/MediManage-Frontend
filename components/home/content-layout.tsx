import { Navbar } from "@/components/home/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
        <div className="px-12 py-8">{children}</div>
    </div>
  );
}
