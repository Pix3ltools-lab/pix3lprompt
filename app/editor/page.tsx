import { DesktopLayout } from "@/components/layout/DesktopLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";

export default function EditorPage() {
  return (
    <>
      {/* Desktop: 3-column layout (>= xl / 1280px) */}
      <div className="hidden xl:block">
        <DesktopLayout />
      </div>

      {/* Mobile/Tablet: tab-based layout (< 1280px) */}
      <div className="xl:hidden">
        <MobileLayout />
      </div>
    </>
  );
}
