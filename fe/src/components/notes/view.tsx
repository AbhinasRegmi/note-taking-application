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
import { useQueries, useQuery } from "@tanstack/react-query";
import { searchCategories } from "@/requests/categories";
import { Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

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
  const [categoryArray, setCategoryArray] = useState(props.categories);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);

  const form = useForm<z.infer<typeof noteformSchema>>({
    resolver: zodResolver(noteformSchema),
    defaultValues: {
      title: props.title,
      content: props.content,
    },
  });

  function handleSubmit(data: z.infer<typeof noteformSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                <TooltipTrigger>
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
            onClick={() => {
              // close the view
              // remove mutation run
            }}
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
