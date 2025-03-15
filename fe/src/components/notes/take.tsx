import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/providers/auth";
import { ROUTES } from "@/constants/routes";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { toast } from "sonner";

export function TakeNote() {
  const [isTakingNote, setIsTakingNote] = useState(true);

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

function removeCategory(
  catKey: string,
  setCat: React.Dispatch<React.SetStateAction<string[]>>
) {
  setCat((i) => {
    const result = i.filter((cat) => cat !== catKey);
    return result;
  });
}

function CatBadge(props: {
  catKey: string;
  setCat: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Badge className="group">
      {props.catKey}
      <span
        className="hidden group-hover:block text-sm font-semibold cursor-pointer"
        onClick={() => removeCategory(props.catKey, props.setCat)}
      >
        x
      </span>
    </Badge>
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
  const [cat, setCat] = useState<string[]>([]);
  const [openCat, setOpenCat] = useState<boolean>(false);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNewNote,
    onSuccess: () => {
      toast.success("New note has been added.");
      client.invalidateQueries({
        queryKey: ["notes-key"],
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
    <>
      <Card className="py-2 px-0">
        <CardContent className="px-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                mutation.mutate({ categories: cat, ...data, session })
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

              <section className="py-1 px-3">
                {cat.map((i) => (
                  <span key={i} className="p-1">
                    <CatBadge catKey={i} setCat={setCat} />
                  </span>
                ))}
              </section>

              <div className="px-3 flex items-center justify-between">
                <NoteCreateDropdown setOpenCat={setOpenCat} />

                {form.formState.isValid ? (
                  <Button
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

      {openCat && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm px-4">
          <div className="p-6 rounded-lg max-w-sm w-full border">
            <AddCategories
              setCat={setCat}
              cat={cat}
              open={openCat}
              setOpen={setOpenCat}
            />
          </div>
        </div>
      )}
    </>
  );
}

function NoteCreateDropdown(props: {
  setOpenCat: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <EllipsisVertical size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => props.setOpenCat(true)}>
          Add Categories
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function searchCategories(search: string, session: string) {
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

interface addCategoriesProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cat: string[];
  setCat: React.Dispatch<React.SetStateAction<string[]>>;
}
function AddCategories({ cat, setCat, open, setOpen }: addCategoriesProps) {
  const { session } = useAuthContext();
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["searchCategories"],
    queryFn: async () => await searchCategories(search, session),
  });

  function setUniqueCat(value: string) {
    if (!cat.includes(value)) {
      setCat([value, ...cat]);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUniqueCat(search);
    setSearch("");
  }

  // debouncing the refetch
  useEffect(() => {
    const handler = setTimeout(() => {
      query.refetch();
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger hidden>Add Categories</DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">Add Categories</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Search categories..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </form>
        <section className="w-full max-w-sm mx-auto pt-4">
          {query.data?.map((i) => (
            <span key={i.name} className="px-2 inline-block py-1">
              <Badge>{i.name}</Badge>
            </span>
          ))}

          {search !== "" && (
            <section className="text-xs text-center">
              Press enter to add <strong className="text-sm">{search}</strong>{" "}
              to note's category
            </section>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
