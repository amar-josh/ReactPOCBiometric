import "./App.css";

import { useEffect } from "react";

import RoutesComponent from "./routes/RoutesComponent";

function App() {
  // Below code prevent user opening dev tools
  // Prevent right-click on web page
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Prevent F12 and Ctrl+Shift+I/C/J and Ctrl+U
  useEffect(() => {
    const blockDevTools = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && ["R"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["I", "C", "J", "R"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockDevTools);
    return () => document.removeEventListener("keydown", blockDevTools);
  }, []);

  return (
    <>
      <RoutesComponent />
    </>
  );
}

export default App;
