import { CATEGORY_QUERY_KEY } from "@/providers/category";
import { NOTE_QUERY_KEY } from "@/providers/notes";
import { deleteNote, updateNote } from "@/requests/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFormUpdate() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (e) => {
      toast.success(e.message);
      client.invalidateQueries({
        queryKey: [NOTE_QUERY_KEY],
      });
      client.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
    },
    onError: (e: string) => {
      let error: string;
      if (typeof e == "string") {
        error = e;
      } else {
        error = "Please try again later";
      }

      toast.error("Uh! oh", {
        description: error,
      });
    },
  });

  return mutation;
}

export function useFormDelete() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (e) => {
      toast.success(e.message);
      client.invalidateQueries({
        queryKey: [NOTE_QUERY_KEY],
      });
    },
    onError: (e: string) => {
      let error: string;
      if (typeof e == "string") {
        error = e;
      } else {
        error = "Please try again later";
      }

      toast.error("Uh! Oh", {
        description: error,
      });
    },
  });

  return mutation;
}
