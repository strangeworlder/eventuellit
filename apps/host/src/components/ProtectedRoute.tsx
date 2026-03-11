import { useRequireAuth } from "@repo/auth/use-require-auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useRequireAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isLoggedIn) {
    return null; // useRequireAuth handles redirect
  }

  return <>{children}</>;
}
