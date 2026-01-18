"use client";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/authContext";
import { IoLibrary } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          permission: "dashboard:view",
        },
      ],
    },
    {
      title: "User Access Management",
      url: "#",
      items: [
        {
          title: "User Management",
          url: "/uam/users",
          permission: "user:view",
        },
        {
          title: "Roles",
          url: "/uam/roles",
          permission: "role:manage",
        },
      ],
    },
    {
      title: "Master Data",
      url: "#",
      items: [
        {
          title: "Categories",
          url: "/master-data/categories",
          permission: "category:view",
        },
        {
          title: "Publishers",
          url: "/master-data/publishers",
          permission: "publisher:view",
        },
        {
          title: "Authors",
          url: "/master-data/authors",
          permission: "author:view",
        },
        {
          title: "Books",
          url: "/master-data/books",
          permission: "book:view",
        },
        {
          title: "Members",
          url: "/master-data/members",
          permission: "member:view",
        },
      ],
    },
    {
      title: "Loans & Fines",
      url: "#",
      items: [
        {
          title: "Loans",
          url: "/transaction/loans",
          permission: "loan:view",
        },
        {
          title: "Fines",
          url: "/transaction/fines",
          permission: "fine:view",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      items: [
        {
          title: "Report",
          url: "/reports",
          permission: "report:view",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Sidebar {...props} />;
  }
  const canView = (permissionCode) => {
    if (!permissionCode) return true;
    return userPermissions.includes(permissionCode);
  };

  const filteredNavMain = data.navMain
    .map((group) => {
      const allowedItems = group.items.filter((item) =>
        canView(item.permission),
      );
      return { ...group, items: allowedItems };
    })
    .filter((group) => group.items.length > 0);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-3 items-center text-2xl font-bold justify-center">
          <IoLibrary />
          <a className="text-green-600" href="/dashboard">
            Perpustakaan
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {filteredNavMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
