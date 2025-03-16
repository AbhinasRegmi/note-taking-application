import { cn } from "@/lib/utils";
import { useSearchQuery } from "../search/query";
import { ViewNote } from "./view";
import { NoteSkeletonList } from "./skeleton";

export function ViewNoteList() {
  const query = useSearchQuery();

  if (query.isLoading) {
    return <NoteSkeletonList />;
  }

  if (query.isSuccess && query.data.length < 1) {
    return (
      <section className="p-8 py-28">
        <h2 className="text-3xl font-semibold tracking-wide text-center">
          There is nothing to see right now!
        </h2>
      </section>
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
    <section className="p-8">
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
    </section>
  );
}
