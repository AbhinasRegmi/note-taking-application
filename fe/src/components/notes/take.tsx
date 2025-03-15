import React, { useRef, useState } from "react";
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

export function TakeNote() {
  const [isTakingNote, setIsTakingNote] = useState(true);

  return (
    <div className="px-4 w-full max-w-sm md:max-w-md mx-auto mt-6">
      {isTakingNote ? (
        <NoteForm handler={setIsTakingNote} />
      ) : (
        <InertState handler={setIsTakingNote} />
      )}
    </div>
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
  categories: z.array(z.string()),
});

interface noteFormPros {
  handler: React.Dispatch<React.SetStateAction<boolean>>;
}
function NoteForm(pros: noteFormPros) {
  const form = useForm<z.infer<typeof noteformSchema>>({
    resolver: zodResolver(noteformSchema),
  });

  function handlesSubmit(data: z.infer<typeof noteformSchema>) {
    console.log(data);
  }

  return (
    <Card className="py-2 px-0">
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlesSubmit)}>
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
            <div className="px-3 flex items-center justify-between">
              <AddCategory />

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
                  onClick={() => pros.handler(false)}
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

function AddCategory() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <EllipsisVertical size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Add Categories</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
