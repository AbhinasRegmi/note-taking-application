import { LoadingSpinner } from "@/components/spinner";
import { ROUTES } from "@/constants/routes";
import { useLocalStorage } from "@/hooks/use-localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface authContextProps {
  email: string | undefined;
  session: string | undefined;
  name: string | undefined;
  logout: () => void;
}
const initialAuthValue = {
  email: undefined,
  session: undefined,
  name: undefined,
  logout: () => {},
};
export const AuthContext = createContext<authContextProps>(initialAuthValue);
export const SESSION_TOKEN_KEY = "note-taking-app-session-key" as const;

async function logoutUser(session: string) {
  try {
    const response = await fetch(`${ROUTES.backend.baseUrl}/auth/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    const body = await response.json();

    if (response.status == 200) {
      return {
        ok: true,
        message: body.message as string,
      };
    }
  } catch (e) {
    throw e;
  }
}

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
  const client = useQueryClient();
  const [session, setSession] = useLocalStorage(SESSION_TOKEN_KEY, "");
  const query = useQuery({
    queryKey: ["login-provider"],
    queryFn: () => getUserProfile(session),
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("You have logged out");
      client.resetQueries();
    },
    onError: () => {
      setSession("");
      client.resetQueries();
    },
  });

  useEffect(() => {
    if (query.isError && !query.isLoading) {
      navigate(ROUTES.backend.endpoints.login_POST);
    }
  }, [query.isError, navigate, session]);

  function logout() {
    mutation.mutate(session);
  }

  if (query.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    !query.isError && (
      <AuthContext.Provider
        value={{
          email: query.data?.email,
          session: query.data?.session,
          name: query.data?.name,
          logout,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    )
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
    logout: data.logout,
  };
}
