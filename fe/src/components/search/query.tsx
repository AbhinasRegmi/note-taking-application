import { ROUTES } from "@/constants/routes";
import { NOTE_QUERY_KEY, searchProps, useRefetchContext } from "./notes";
import { useAuthContext } from "@/providers/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesSearchProps,
  CATEGORY_QUERY_KEY,
  useCategoriesContext,
} from "./category";
import { toast } from "sonner";

type searchNotesProps = {
  session: string;
} & searchProps;
type noteResponse = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
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

async function deleteCategory(props: { session: string; id: string }) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/categories/${props.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${props.session}`,
        },
      }
    );

    if (response.status == 200) {
      return {
        ok: true,
      };
    }

    if (response.status == 401) {
      throw "You are not authorized to delete this category.";
    }

    throw "Try again later.";
  } catch (e) {
    throw e;
  }
}

export function useDeleteCategory() {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Success", {
        description: "Category has been removed",
      });
      client.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
    },
    onError: (e) => {
      let error;
      if (typeof e == "string") {
        error = e;
      } else {
        error = "Something went wrong. Try again later";
      }

      toast.error("Uh! oh", {
        description: error,
      });
    },
  });

  return mutation;
}

async function searchNoteWithCategory(props: {
  session: string;
  categoryName: string;
  page: string;
}) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/categories/filter?categories=${props.categoryName}&take=100`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${props.session}`
        }
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return body as {
        title: string;
        content: string;
        id: string;
        categories: string[];
      }[];
    }

    if (response.status == 401) {
      throw "You are not authorized.";
    }

    throw body.message ?? "Something went wrong.";
  } catch (e) {
    throw e;
  }
}

export function useSearchNoteWithCategory(categoryName: string) {
  const { session } = useAuthContext();
  const { page } = useCategoriesContext();
  const query = useQuery({
    queryKey: ["search-note-with-category"],
    queryFn: () =>
      searchNoteWithCategory({
        session,
        categoryName,
        page,
      }),
  });

  return query;
}
