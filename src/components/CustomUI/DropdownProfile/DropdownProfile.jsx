"use client";
import { LogoutAction } from "@/actions/auth/action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/authContext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const DropdownProfile = () => {
  const [mounted, setMounted] = useState();
  const logoutButton = async () => {
    await LogoutAction();
    toast.success("Logout successful");
  };
  const { user } = useAuth();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div>Profile</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none cursor-pointer"
        asChild
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col border p-2 rounded-sm">
            <span className="text-sm font-bold">{user?.name || "Guest"}</span>
            <span className="text-sm font-normal">
              {user?.roles.join("-") || "No Role"}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => logoutButton()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownProfile;
