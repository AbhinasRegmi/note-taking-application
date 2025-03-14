import { createContext, PropsWithChildren, useContext } from "react";

interface authContextProps {
  email: string | undefined;
  session: string | undefined;
  name: string | undefined;
}
const initialAuthValue = {
  email: undefined,
  session: undefined,
  name: undefined,
};
export const AuthContext = createContext<authContextProps>(initialAuthValue);

export function AuthProvider(props: PropsWithChildren) {
  //TODO: get data by login
  return (
    <AuthContext.Provider
      value={{
        email: "theflexdev@gmail.com",
        session: "randomsession",
        name: "theflexdev",
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const data = useContext(AuthContext);

  if (!data.email || !data.name || !data.session) {
    throw new Error("Auth context must be used inside an auth provider");
  }

  return {
    email: data.email,
    name: data.name,
    session: data.session,
  };
}
