import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./use-auth";

export function useRequireAuth() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/kirjaudu");
    }
  }, [isLoggedIn, isLoading, navigate]);

  return { isLoggedIn, isLoading };
}
