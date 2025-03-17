import { TakeNote } from "@/components/notes/create";
import { ViewNoteList } from "@/components/notes/view-list";

export function HomePage() {
  return (
    <section>
      <TakeNote />
      <ViewNoteList />
    </section>
  );
}
