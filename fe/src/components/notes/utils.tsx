import { useAuthContext } from "@/providers/auth";
import { Badge } from "../ui/badge";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCategoriesWithMissingGlobalScope } from "@/requests/categories";
import { Input } from "../ui/input";
import { CATEGORY_QUERY_KEY } from "../search/category";
import { humanizeDate } from "@/lib/date";

export function CategoryBadge(props: {
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

export function CategoryForm(props: {
  setCategoryArray: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { session } = useAuthContext();
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const query = useQuery({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: async () =>
      await searchCategoriesWithMissingGlobalScope(search, session),
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
          query.data?.map((i: { name: string }) => (
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

export function SectionFullPage(props: PropsWithChildren) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between p-8">
      {props.children}
    </div>
  );
}

export function TimeFromNow(props: { datetime: string }) {
  return (
    <div className="text-xs px-2 text-end opacity-60">
      Edited {humanizeDate(props.datetime)}
    </div>
  );
}
