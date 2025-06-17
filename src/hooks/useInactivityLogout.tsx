import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/routes/constants";
import { clearToken } from "@/services/api.service";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const useInactivityLogout = (isAuthenticated: boolean) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    // Clear any existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timer
    timeoutRef.current = setTimeout(() => {
      if (isAuthenticated) {
        clearToken(); // Clear the token
        // Redirect to session expired screen
        navigate(ROUTES.SESSION_EXPIRED, {
          replace: true,
        });
      }
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, navigate]);

  // Function to handle user activity
  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (isAuthenticated) {
      // Start the timer when component mounts and user is authenticated
      resetTimer();
      // Add mouse and keyboard event listeners to detect user activity
      document.addEventListener("mousemove", handleActivity);
      document.addEventListener("keydown", handleActivity);
      document.addEventListener("scroll", handleActivity);
      document.addEventListener("click", handleActivity);
      // Add mobile touch events
      document.addEventListener("touchstart", handleActivity);
      document.addEventListener("touchmove", handleActivity);
      document.addEventListener("touchend", handleActivity);
      document.addEventListener("touchcancel", handleActivity);

      // Clean up event listeners and timer when component unmounts or user logs out
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // Remove mouse and keyboard events
        document.removeEventListener("mousemove", handleActivity);
        document.removeEventListener("keydown", handleActivity);
        document.removeEventListener("scroll", handleActivity);
        document.removeEventListener("click", handleActivity);
        // Remove mobile touch events
        document.removeEventListener("touchstart", handleActivity);
        document.removeEventListener("touchmove", handleActivity);
        document.removeEventListener("touchend", handleActivity);
        document.removeEventListener("touchcancel", handleActivity);
      };
    } else {
      // If user is not authenticated, ensure no timer is running
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isAuthenticated, resetTimer, handleActivity]);

  // Expose the resetTimer function for external use if needed in future purpose for API calls or other interactions
  return { resetInactivityTimer: resetTimer };
};
export default useInactivityLogout;
