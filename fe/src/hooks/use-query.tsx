import { NOTE_QUERY_KEY, useRefetchContext } from "../providers/notes";
import { useAuthContext } from "@/providers/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CATEGORY_QUERY_KEY,
  useCategoriesContext,
} from "../providers/category";
import { toast } from "sonner";
import { createNewNote, searchNotes } from "../requests/notes";
import {
  deleteCategory,
  searchCategories,
  searchNoteWithCategory,
} from "@/requests/categories";

export function useCreateNoteQuery(handler: (i: boolean) => void) {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewNote,
    onSuccess: () => {
      toast.success("New note has been added.");
      client.invalidateQueries({
        queryKey: [NOTE_QUERY_KEY],
      });
      client.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
      handler(false);
    },
    onError: (e) => {
      let error;
      if (typeof e == "string") {
        error = e;
      } else {
        error = "Something went wrong. Try again later";
      }

      toast.error("Uh! oh There is an error", {
        description: error,
      });
    },
  });

  return mutation;
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
