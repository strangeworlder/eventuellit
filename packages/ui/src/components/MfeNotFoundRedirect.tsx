import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestToast } from "./Toast";

export const MFE_NOT_FOUND_TOAST_MESSAGE = "Sivua ei löydy. Uudelleenohjattu lähimpään vanhempaan.";

/**
 * Shows a warning toast and replaces the route when an MFE hits an unknown path.
 */
export function MfeNotFoundRedirect({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      requestToast({
        message: MFE_NOT_FOUND_TOAST_MESSAGE,
        variant: "warning",
        duration: 0,
      });
      navigate(to, { replace: true });
    }, 0);
    return () => clearTimeout(timer);
  }, [navigate, to]);
  return null;
}
