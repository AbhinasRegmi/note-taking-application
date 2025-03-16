import { cn } from "@/lib/utils";
import { useSearchQuery } from "../search/query";
import { ViewNote } from "./view";
import { NoteSkeletonList } from "./skeleton";
import { PaginateNotes } from "./paginate";
import { PropsWithChildren } from "react";

export function ViewNoteList() {
  const query = useSearchQuery();

  if (query.isLoading) {
    return <NoteSkeletonList />;
  }

  if (query.isSuccess && query.data.length < 1) {
    return (
      <SectionFullPage>
        <section className="p-8 py-28">
          <h2 className="text-3xl font-semibold tracking-wide text-center">
            There is nothing to see right now!
          </h2>
        </section>
        <PaginateNotes />
      </SectionFullPage>
    );
  }

  if (query.isError) {
    return (
      <section className="p-8 py-28">
        <h2 className="text-3xl font-semibold tracking-wide text-center">
          Oh! oh Please try again
        </h2>
      </section>
    );
  }

  return (
    <SectionFullPage>
      <div
        className={cn(
          "flex flex-wrap gap-8",
          query.isRefetching && "opacity-80"
        )}
      >
        {query.data?.map((note) => (
          <ViewNote {...note} />
        ))}
      </div>
      <PaginateNotes />
    </SectionFullPage>
  );
}

function SectionFullPage(props: PropsWithChildren) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between p-8">
      {props.children}
    </div>
  );
}
