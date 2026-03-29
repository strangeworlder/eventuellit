import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface PlayerUser {
  id: number;
  username: string;
  email: string;
}

export const usePlayerUsers = () => {
  return useQuery<PlayerUser[]>({
    queryKey: ["playerUsers"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/users?role=player`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch player users");
      return response.json();
    },
  });
};
