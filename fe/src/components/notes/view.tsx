import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { useAuthContext } from "@/providers/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchCategories } from "@/requests/categories";
import { Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

interface viewNoteProps {
  id: string;
  title: string;
  content: string;
  categories: string[];
}
export function ViewNote(props: viewNoteProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      {isEditOpen ? (
        <EditNoteView
          dialogStatus={isEditOpen}
          setDialogStatus={setIsEditOpen}
          {...props}
        />
      ) : (
        <SimpleNoteView setIsEditOpen={setIsEditOpen} {...props} />
      )}
    </>
  );
}

function SimpleNoteView(
  props: viewNoteProps & {
    setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  return (
    <Card onClick={() => props.setIsEditOpen(true)}>
      <CardContent>this is card</CardContent>
    </Card>
  );
}

function EditNoteView(
  props: viewNoteProps & {
    setDialogStatus: React.Dispatch<React.SetStateAction<boolean>>;
    dialogStatus: boolean;
  }
) {
  return (
    <BlurWithContentAtCenter>
      <Dialog onOpenChange={props.setDialogStatus} open={props.dialogStatus}>
        <DialogContent className="outline-0">
          <EditNoteForm
            id={props.id}
            title={props.title}
            content={props.content}
            categories={props.categories}
            closeFormHandler={props.setDialogStatus}
          />
        </DialogContent>
      </Dialog>
    </BlurWithContentAtCenter>
  );
}

function BlurWithContentAtCenter(props: PropsWithChildren) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center backdrop-blur-xs px-4 justify-center lg:-mr-[50px] z-50",
        isSidebarOpen && "lg:-mr-[250px]"
      )}
    >
      <div className="py-6 px-3 rounded-lg max-w-sm w-full border bg-background">
        {props.children}
      </div>
    </div>
  );
}

function CategoryBadge(props: {
  categoryName: string;
  setCategoryArray: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Badge className="group">
      {props.categoryName}
      <span
        className="hidden group-hover:block text-sm font-semibold cursor-pointer"
        onClick={() => {
          props.setCategoryArray((categoryArr) => {
            return categoryArr.filter(
              (category) => category != props.categoryName
            );
          });
        }}
      >
        x
      </span>
    </Badge>
  );
}

const noteformSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
});

function EditNoteForm(
  props: viewNoteProps & {
    closeFormHandler: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  const { session } = useAuthContext();
  const [categoryArray, setCategoryArray] = useState(props.categories);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const updateQuery = useFormUpdate();
  const deleteQuery = useFormDelete();

  const form = useForm<z.infer<typeof noteformSchema>>({
    resolver: zodResolver(noteformSchema),
    defaultValues: {
      title: props.title,
      content: props.content,
    },
  });

  function handleUpdate(data: z.infer<typeof noteformSchema>) {
    updateQuery.mutate({
      id: props.id,
      ...data,
      categories: categoryArray,
      session,
    });
  }

  function handleDelete() {
    deleteQuery.mutate({
      id: props.id,
      session,
    });
  }

  useEffect(() => {
    if (updateQuery.isSuccess || deleteQuery.isSuccess) {
      props.closeFormHandler(false);
    }
  }, [updateQuery.isSuccess, deleteQuery.isSuccess, props.closeFormHandler]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdate)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoFocus
                  className="shadow-none border-0 px-0 focus-visible:ring-0 dark:bg-background dark:text-foreground text-lg"
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
                  className="shadow-none border-0 px-0 focus-visible:ring-0 dark:bg-background dark:text-foreground"
                  placeholder="Take a note..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <section className="py-4 flex items-end justify-between">
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
                <TooltipContent>Open category form</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </section>

        {openCategoryForm && (
          <CategoryForm setCategoryArray={setCategoryArray} />
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant={"destructive"}
            size={"sm"}
            key={"delete"}
            onClick={handleDelete}
          >
            Delete
          </Button>
          {form.formState.isValid ? (
            <Button
              type="submit"
              key="submit"
              size={"sm"}
              variant={"secondary"}
            >
              Update
            </Button>
          ) : (
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => props.closeFormHandler(false)}
              type="button"
              key="cancel"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

function CategoryForm(props: {
  setCategoryArray: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { session } = useAuthContext();
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const query = useQuery({
    queryKey: ["searchCategories"],
    queryFn: async () => await searchCategories(search, session),
  });

  function handleSubmit(searchText: string) {
    props.setCategoryArray((categoryArray) => {
      if (!categoryArray.includes(searchText)) {
        return [searchText, ...categoryArray];
      }
      return categoryArray;
    });
    setSearch("");
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      query.refetch();
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            handleSubmit(search);
          }
        }}
      >
        <Input
          ref={inputRef}
          placeholder="Add new categories..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </form>

      <section className="w-full max-w-sm mx-auto pt-4">
        {search !== "" &&
          query.data?.map((i) => (
            <span key={i.name} className="px-2 inline-block py-1 opacity-40">
              <Badge
                onClick={() => {
                  handleSubmit(i.name);
                }}
                className="cursor-pointer"
              >
                {i.name}
              </Badge>
            </span>
          ))}
      </section>

      {search !== "" && (
        <section className="text-xs text-center">
          Press enter to add <strong className="text-sm">{search}</strong> to
          note's category
        </section>
      )}
    </>
  );
}

interface updateNoteProps {
  title: string;
  content: string;
  categories: string[];
  id: string;
  session: string;
}
async function updateNote(props: updateNoteProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/notes/${props.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.session}`,
        },
        body: JSON.stringify({
          title: props.title,
          content: props.content,
          categories: props.categories,
        }),
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return {
        ok: true,
        message: "Your note has been updated.",
      };
    }

    if (response.status == 409) {
      throw "Please change the title.";
    }

    if (response.status == 401) {
      throw "You do not have access to update this note.";
    }

    throw body.message ?? "Try again later.";
  } catch (e) {
    throw e;
  }
}

function useFormUpdate() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (e) => {
      toast.success(e.message);
      client.invalidateQueries({
        queryKey: ["notes-key"],
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

interface deleteNoteProps {
  id: string;
  session: string;
}
async function deleteNote(props: deleteNoteProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/notes/${props.id}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.session}`,
        },
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return {
        ok: true,
        message: "Your note has been deleted.",
      };
    }

    if (response.status == 404) {
      throw "Cannot delete the note.";
    }

    if (response.status == 401) {
      throw "You do not have access to update this note.";
    }

    throw body.message ?? "Try again later.";
  } catch (e) {
    throw e;
  }
}

function useFormDelete() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (e) => {
      toast.success(e.message);
      client.invalidateQueries({
        queryKey: ["notes-key"],
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
