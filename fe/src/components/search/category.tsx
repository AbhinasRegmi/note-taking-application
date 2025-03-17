import { useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router";

export interface categoriesSearchProps {
  take: string | undefined;
  page: string | undefined;
  search: string | undefined;
}
export type refetchContextProps = {
  setSearchParams: SetURLSearchParams | undefined;
} & categoriesSearchProps;
export const CategoryContext = createContext<refetchContextProps>({
  take: undefined,
  page: undefined,
  search: undefined,
  setSearchParams: undefined,
});

export const CATEGORY_QUERY_KEY = "category-query-key" as const;

export function useCategoriesContext() {
  const data = useContext(CategoryContext);

  if (!data.page || !data.setSearchParams || !data.take) {
    throw new Error(
      "useCategoriesContext should be used inside a CategoryProvider"
    );
  }

  return {
    page: data.page,
    take: data.take,
    search: data.search,
    setSearchParams: data.setSearchParams,
  };
}

export function CategoriesProvider(props: PropsWithChildren) {
  const [searchParams, setSearchParams] = useSearchParams();
  const client = useQueryClient();

  useEffect(() => {
    client.invalidateQueries({
      queryKey: [CATEGORY_QUERY_KEY],
    });
  }, [searchParams]);

  return (
    <CategoryContext.Provider
      value={{
        take: searchParams.get("take") ?? "30",
        page: searchParams.get("page") ?? "0",
        search: searchParams.get("search") ?? "",
        setSearchParams,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
}
