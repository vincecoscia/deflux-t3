import { createContext, useState } from "react";

interface IGlobalContextProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const SideNavContext = createContext<IGlobalContextProps>({
  isCollapsed: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsCollapsed: () => {},
});

export const SideNavProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <SideNavContext.Provider value={{
      isCollapsed,
      setIsCollapsed,
    }}>
      {children}
    </SideNavContext.Provider>
  );
};
