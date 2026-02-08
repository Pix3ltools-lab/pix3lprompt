import { DesktopLayout } from "@/components/layout/DesktopLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";

export default function EditorPage() {
  return (
    <>
      {/* Desktop: 3-column layout (>= xl / 1280px) */}
      <div className="hidden min-h-0 flex-1 xl:flex">
        <DesktopLayout />
      </div>

      {/* Mobile/Tablet: tab-based layout (< 1280px) */}
      <div className="flex min-h-0 flex-1 flex-col xl:hidden">
        <MobileLayout />
      </div>
    </>
  );
}
