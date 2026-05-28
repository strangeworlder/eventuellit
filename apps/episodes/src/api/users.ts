import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

export interface PlayerUser {
  id: number;
  username: string;
  email: string;
}

export const usePlayerUsers = () => {
  return useQuery<PlayerUser[]>({
    queryKey: queryKeys.users.players,
    queryFn: () => apiFetch<PlayerUser[]>("/users?role=player"),
  });
};
