import { ROUTES } from "@/constants/routes";
import { categoriesSearchProps } from "@/providers/category";

export async function searchCategoriesWithMissingGlobalScope(search: string, session: string) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/categories?search=${search}&take=15`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    );

    const body = await response.json();

    if (response.status !== 200) {
      throw "Cannot search";
    }

    return body as Record<"name", string>[];
  } catch (e) {
    if (typeof e == "string") {
      throw e;
    }
    throw "Something went wrong";
  }
}

type searchCategoriesProps = {
  session: string;
} & categoriesSearchProps;

export type categoriesResponse = {
  id: string;
  name: string;
  count: string;
};

export async function searchCategories(props: searchCategoriesProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/categories?take=${props.take}&page=${props.page}&search=${props.search ?? ""}`,
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

export async function deleteCategory(props: { session: string; id: string; }) {
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

export async function searchNoteWithCategory(props: {
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
        updatedAt: string;
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
