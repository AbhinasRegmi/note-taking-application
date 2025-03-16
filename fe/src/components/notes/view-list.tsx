import { ViewNote } from "./view";

export function ViewNoteList() {
  return (
    <section className="p-5">
      <ViewNote
        id="1"
        title="title aljskdf this is super fdjlkajsldj ajldfjlsdajf sdfjdsl"
        content="nnn thi si s lorem epsum sjis sjs s s s Changed the CardTitle and CardDescription components to use div instead of h3 and p to improve accessibility "
        categories={["abhinas"]}
      />
    </section>
  );
}
