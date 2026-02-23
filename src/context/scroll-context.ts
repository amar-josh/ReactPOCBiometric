import { createContext, useContext } from "react";

export interface IScrollContextType {
  scrollToContentTop: () => void;
}

const ScrollContext = createContext<IScrollContextType | undefined>(undefined);

export const useScrollToContentTop = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    console.log(
      "Error: Context not found, useScrollToContentTop must be used within a ScrollProvider"
    );
  }
  return context;
};

export default ScrollContext;
