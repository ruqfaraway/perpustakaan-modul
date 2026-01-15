import "../globals.css";

export const metadata = {
  title: "Perpustakaan",
  description: "Sebuah aplikasi perpustakaan buatan aku",
};

import { AppSidebar } from "@/components/app-sidebar";
import DropdownProfile from "@/components/CustomUI/DropdownProfile/DropdownProfile";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <DropdownProfile />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
