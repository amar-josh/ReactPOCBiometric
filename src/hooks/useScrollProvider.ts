import { useCallback, useRef } from "react";

export function useScrollProvider() {
  const mainContentRef = useRef<HTMLElement>(null);

  const scrollToContentTop = useCallback(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  return {
    mainContentRef,
    scrollToContentTop,
  };
}
