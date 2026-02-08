import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  title: string;
  children: React.ReactNode;
}

export function Sidebar({ title, children }: SidebarProps) {
  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center px-4">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </aside>
  );
}
