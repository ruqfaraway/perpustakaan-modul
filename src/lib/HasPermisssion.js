"use client";
import * as React from "react";
import { useAuth } from "./authContext";

export function HasPermission({ code, children, fallback }) {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  const hasAccess = userPermissions.includes(code);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }
  return null;
}
