import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl, getAuthHeaders } from "./base-url";

export interface PlayerUser {
  id: number;
  username: string;
  email: string;
}

export const usePlayerUsers = () => {
  return useQuery<PlayerUser[]>({
    queryKey: ["playerUsers"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/users?role=player`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch player users");
      return response.json();
    },
  });
};
