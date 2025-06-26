import { createContext, useContext } from "react";

export interface IScrollContextType {
  scrollToContentTop: () => void;
}

const ScrollContext = createContext<IScrollContextType | undefined>(undefined);

export const useScrollToContentTop = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("Something went wrong");
  }
  return context;
};

export default ScrollContext;
