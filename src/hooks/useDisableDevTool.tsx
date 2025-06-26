import { useEffect } from "react";

const useDisableDevTool = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const blockDevTools = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const isCtrl = e.ctrlKey;
      const isShift = e.shiftKey;

      if (
        key === "F12" ||
        (isCtrl && ["R", "U"].includes(key)) ||
        (isCtrl && isShift && ["I", "C", "J", "R"].includes(key))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockDevTools);
    return () => {
      document.removeEventListener("keydown", blockDevTools);
    };
  }, []);
};

export default useDisableDevTool;
