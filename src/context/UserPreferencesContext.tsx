import { createContext, useState } from "react";
import type { UserPreference } from "@prisma/client";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface IGlobalContextProps {
  userPreferences: UserPreference[];
  setUserPreferences: (userPreferences: UserPreference[]) => void;
  refetchUserPreferences: () => void;
}

export const UserPreferenceContext = createContext<IGlobalContextProps>({
  userPreferences: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPreferences: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetchUserPreferences: () => new Promise(() => {}),
});

export const UserPreferenceProvider = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const { data: sessionData } = useSession();

  const { data: userPreferenceData, refetch: refetchUserPreferences } =
    trpc.userPreferenceRouter.getUserPreferences.useQuery(
      undefined,
      {
        onSuccess(userPreferenceData) {
          setUserPreferences(userPreferenceData);
        },
        onError(error) {
          // return a response if there is an error
          console.log(error);
        },
        enabled: sessionData ? true : false,
      }
    );

      console.log("USER PREFERENCES", userPreferences);

  return (
    <UserPreferenceContext.Provider value={{
      userPreferences,
      setUserPreferences,
      refetchUserPreferences
    }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};
