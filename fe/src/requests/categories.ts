import { ROUTES } from "@/constants/routes";

export async function searchCategories(search: string, session: string) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/categories?search=${search}&take=20`,
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