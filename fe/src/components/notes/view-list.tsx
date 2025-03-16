import { ViewNote } from "./view";

export function ViewNoteList() {
  return (
    <section>
      <ViewNote id="1" title="title" content="this is the content" categories={["hello", "nice", "good"]} />
    </section>
  )
}
