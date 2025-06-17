import { createContext, useContext } from "react";

export interface IScrollContextType {
  scrollToContentTop: () => void;
}

const ScrollContext = createContext<IScrollContextType | undefined>(undefined);

export const useScrollToContentTop = () => {
  const context = useContext(ScrollContext);
  if (context) return context;
};

export default ScrollContext;
