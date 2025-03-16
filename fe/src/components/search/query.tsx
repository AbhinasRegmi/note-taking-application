import { ROUTES } from "@/constants/routes";
import { NOTE_QUERY_KEY, searchProps, useRefetchContext } from "./notes";
import { useAuthContext } from "@/providers/auth";
import { useQuery } from "@tanstack/react-query";
import {
  categoriesSearchProps,
  CATEGORY_QUERY_KEY,
  useCategoriesContext,
} from "./category";

type searchNotesProps = {
  session: string;
} & searchProps;
type noteResponse = {
  id: string;
  title: string;
  content: string;
  categories: string[];
};
async function searchNotes(props: searchNotesProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/notes?take=${props.take}&page=${
        props.page
      }&orderBy=${props.orderBy}&sortOrder=${props.sortOrder}&search=${
        props.search ?? ""
      }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.session}`,
        },
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return body as noteResponse[];
    }

    if (response.status == 401) {
      throw "You are not authorized";
    }

    throw body.messsage ?? "Something went wrong";
  } catch (e) {
    throw e;
  }
}
export function useSearchQuery() {
  const { session } = useAuthContext();
  const data = useRefetchContext();

  const query = useQuery({
    queryKey: [NOTE_QUERY_KEY],
    queryFn: () =>
      searchNotes({
        session,
        ...data,
      }),
  });

  return query;
}

type searchCategoriesProps = {
  session: string;
} & categoriesSearchProps;
export type categoriesResponse = {
  id: string;
  name: string;
  count: string;
};
async function searchCategories(props: searchCategoriesProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/categories?take=${props.take}&page=${
        props.page
      }&search=${props.search ?? ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.session}`,
        },
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return body as categoriesResponse[];
    }

    if (response.status == 401) {
      throw "You are not authorized";
    }

    throw body.messsage ?? "Something went wrong";
  } catch (e) {
    throw e;
  }
}

export function useCategoriesQuery() {
  const { session } = useAuthContext();
  const data = useCategoriesContext();

  const query = useQuery({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: () =>
      searchCategories({
        session,
        ...data,
      }),
  });
  
  return query;
}
