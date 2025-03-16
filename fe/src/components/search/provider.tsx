import { useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router";

export interface searchProps {
  take: string | undefined;
  page: string | undefined;
  orderBy: string | undefined; // "title" | "createdAt" | "updatedAt";
  sortOrder: string | undefined; // "asc" | "desc";
  search: string | undefined;
}
type refetchContextProps = {
  setSearchParams: SetURLSearchParams | undefined;
} & searchProps;

export const RefetchContext = createContext<refetchContextProps>({
  take: undefined,
  page: undefined,
  orderBy: undefined,
  sortOrder: undefined,
  search: "",
  setSearchParams: undefined,
});

export const NOTE_QUERY_KEY = "note-query-key" as const;

export function useRefetchContext() {
  const data = useContext(RefetchContext);

  if (
    !data.orderBy ||
    !data.page ||
    !data.setSearchParams ||
    !data.sortOrder ||
    !data.take
  ) {
    throw new Error(
      "useRefetchContext should be used inside a refetch provider"
    );
  }

  return {
    orderBy: data.orderBy,
    page: data.page,
    setSearchParams: data.setSearchParams,
    sortOrder: data.sortOrder,
    take: data.take,
    search: '',
  };
}

export function RefetchProvider(props: PropsWithChildren) {
  const [searchParams, setSearchParams] = useSearchParams();
  const client = useQueryClient();

  useEffect(() => {
    client.invalidateQueries({
      queryKey: [NOTE_QUERY_KEY],
    });
  }, [searchParams]);

  return (
    <RefetchContext.Provider
      value={{
        take: searchParams.get("take") ?? "10",
        page: searchParams.get("page") ?? "0",
        orderBy: searchParams.get("orderBy") ?? "updatedAt",
        sortOrder: searchParams.get("sortOrder") ?? "desc",
        search: searchParams.get("search") ?? "",
        setSearchParams,
      }}
    >
      {props.children}
    </RefetchContext.Provider>
  );
}
