import React, { useState } from "react";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/providers/auth";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { NOTE_QUERY_KEY } from "../search/notes";
import { CategoryBadge, CategoryForm } from "./utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CATEGORY_QUERY_KEY } from "../search/category";

export function TakeNote() {
  const [isTakingNote, setIsTakingNote] = useState(false);

  return (
    <section>
      <div className="px-4 w-full max-w-sm md:max-w-md mx-auto mt-6">
        {isTakingNote ? (
          <NoteForm handler={setIsTakingNote} />
        ) : (
          <InertState handler={setIsTakingNote} />
        )}
      </div>
    </section>
  );
}

interface inertStatePros {
  handler: React.Dispatch<React.SetStateAction<boolean>>;
}
function InertState(props: inertStatePros) {
  return (
    <Input
      key={"inert"}
      className="py-6 tracking-wider"
      placeholder="Take a note..."
      onFocusCapture={() => props.handler((p) => !p)}
      onClick={() => props.handler((p) => !p)}
    />
  );
}

const noteformSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
});

async function createNewNote(data: {
  title: string;
  content: string;
  categories: string[];
  session: string;
}) {
  try {
    const response = await fetch(`${ROUTES.backend.baseUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session}`,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        categories: data.categories,
      }),
    });

    const body = await response.json();

    if (response.status === 201) {
      return {
        ok: true,
        data: body,
      };
    }

    if (response.status == 401) {
      throw "You do not access to create notes. Try again after login";
    }

    throw body.message ?? "Try again with different title";
  } catch (e) {
    if (typeof e == "string") {
      throw e;
    }

    throw "Something went wrong";
  }
}

interface noteFormPros {
  handler: React.Dispatch<React.SetStateAction<boolean>>;
}
function NoteForm(props: noteFormPros) {
  const { session } = useAuthContext();
  const [categoryArray, setCategoryArray] = useState<string[]>([]);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);

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
      props.handler(false);
    },
    onError: (e: string) => {
      toast.error("Uh! oh There is an error", {
        description: e,
      });
    },
  });

  const form = useForm<z.infer<typeof noteformSchema>>({
    resolver: zodResolver(noteformSchema),
  });

  return (
    <Card className="py-2 px-0">
      <CardContent className="px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              mutation.mutate({ categories: categoryArray, ...data, session })
            )}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoFocus
                      className="shadow-none border-0 focus-visible:ring-0 dark:bg-card dark:text-card-foreground text-lg"
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="shadow-none border-0 focus-visible:ring-0 dark:bg-card dark:text-card-foreground"
                      placeholder="Take a note..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <section className="py-4 flex items-end justify-between px-2">
              <div className="grow shrink-0 flex flex-wrap w-3/4">
                {categoryArray.map((category) => (
                  <span key={category} className="p-1">
                    <CategoryBadge
                      categoryName={category}
                      setCategoryArray={setCategoryArray}
                    />
                  </span>
                ))}
              </div>

              {openCategoryForm ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <X
                        className="cursor-pointer hover:bg-accent rounded-full"
                        onClick={() => setOpenCategoryForm((p) => !p)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>close category form</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Plus
                        className="cursor-pointer hover:bg-accent rounded-full"
                        onClick={() => setOpenCategoryForm((p) => !p)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Add Categories</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </section>

            {openCategoryForm && (
              <div className="px-3">
                <CategoryForm setCategoryArray={setCategoryArray} />
              </div>
            )}

            <div className="px-3 flex items-center justify-end">
              {form.formState.isValid ? (
                <Button
                  disabled={mutation.isPending}
                  type="submit"
                  key="submit"
                  size={"sm"}
                  variant={"secondary"}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  onClick={() => props.handler(false)}
                  type="button"
                  key="cancel"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
