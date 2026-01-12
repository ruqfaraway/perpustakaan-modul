import * as React from "react";
import { ChevronRight } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
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
import { IoLibrary } from "react-icons/io5";

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
        },
        {
          title: "Roles",
          url: "/uam/roles",
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
        },
        {
          title: "Publishers",
          url: "/master-data/publishers",
        },
        {
          title: "Authors",
          url: "/master-data/authors",
        },
        {
          title: "Books",
          url: "/master-data/books",
        },
        {
          title: "Members",
          url: "/master-data/members",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-3 items-center text-2xl font-bold justify-center">
          <IoLibrary />
          <p className="text-green-600">Perpustakaan</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
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
