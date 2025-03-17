import { TakeNote } from "@/components/notes/take";
import { ViewNoteList } from "@/components/notes/view-list";

export function HomePage() {
  return (
    <section>
      <TakeNote />
      <ViewNoteList />
    </section>
  );
}
