import { ROUTES } from "@/constants/routes";
import { useLocalStorage } from "@/hooks/use-localStorage";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

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

async function getUserProfile(session: string) {
  try {
    if (!session) throw new Error("No session available");

    const response = await fetch(`${ROUTES.backend.baseUrl}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        session,
      };
    } else {
      throw new Error("Please login again.");
    }
  } catch (e) {
    throw e;
  }
}

export function AuthProvider(props: PropsWithChildren) {
  const navigate = useNavigate();
  const [session, _] = useLocalStorage("note-taking-app-session-key", "");
  const query = useQuery({
    queryKey: ["login-provider"],
    queryFn: () => getUserProfile(session),
    retry: false,
  });

  useEffect(() => {
    console.log('inside');

    if (query.isError && !query.isLoading) {
      navigate(ROUTES.backend.endpoints.login_POST);
    }
  }, [query.isError, navigate]);

  if (query.isLoading)  {
    return <div>loading...</div>;
  }

  return (
    !query.isError && <AuthContext.Provider
      value={{
        email: query.data?.email,
        session: query.data?.session,
        name: query.data?.name,
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
