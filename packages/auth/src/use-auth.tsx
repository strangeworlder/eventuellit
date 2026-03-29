import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logout as logoutApi } from "./api";
import type { AuthUser } from "./types";

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<AuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return {
    user: user ?? null,
    isLoggedIn: user !== null && user !== undefined,
    isLoading,
    error,
    logout: () => logoutMutation.mutate(),
  };
}
