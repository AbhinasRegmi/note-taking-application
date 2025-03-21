import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { CategoryBadge, CategoryForm, TimeFromNow } from "./utils";
import { useFormDelete, useFormUpdate } from "@/hooks/use-form";

interface viewNoteProps {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
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
    <Card onClick={() => props.setIsEditOpen(true)} className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="line-clamp-1">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="line-clamp-3 min-h-12">
        {props.content}
      </CardContent>
      <CardFooter className="overflow-clip flex flex-wrap items-end max-h-17">
        {props.categories?.map((category) => (
          <span key={category} className="inline-block p-1">
            <Badge>{category}</Badge>
          </span>
        ))}
      </CardFooter>
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
            updatedAt={props.updatedAt}
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
    <div>
      <TimeFromNow datetime={props.updatedAt} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
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
                    autoFocus
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
                  <TooltipContent>Add Categories</TooltipContent>
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
              disabled={deleteQuery.isPending}
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
                disabled={updateQuery.isPending}
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
    </div>
  );
}
