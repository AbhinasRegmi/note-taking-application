import { cn } from "@/lib/utils";
import { categoriesResponse, useCategoriesQuery } from "../search/query";
import { CategoriesSkeletonList } from "./skeleton";
import { PropsWithChildren } from "react";
import { PaginateNotes } from "../notes/paginate";
import { Badge } from "../ui/badge";
import { Link } from "react-router";

export function ViewCategoriesList() {
  const query = useCategoriesQuery();

  if (query.isLoading) {
    return <CategoriesSkeletonList />;
  }

  if (query.isSuccess && query.data.length < 1) {
    return (
      <SectionFullPage>
        <section className="lg:p-8 lg:py-28 py-12">
          <h2 className="text-3xl font-semibold tracking-wide text-center">
            There is nothing to see right now!
          </h2>
        </section>
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
          "flex flex-wrap gap-6",
          query.isRefetching && "opacity-80"
        )}
      >
        {query.data?.map((category) => (
          <ViewCategory key={category.id} {...category} />
        ))}
      </div>
    </SectionFullPage>
  );
}

function SectionFullPage(props: PropsWithChildren) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between p-8">
      <div className="flex w-full justify-center">
        <div className="flex flex-wrap p-12 gap-8 max-w-lg justify-center">
          {props.children}
        </div>
      </div>
      <PaginateNotes />
    </div>
  );
}

function ViewCategory(props: categoriesResponse) {
  return (
    <Link to={`/categories/${props.name}`}>
      <Badge className="text-sm">
        <strong>{props.name}</strong>{" "}
        <span className="text-xs">{props.count}</span>
      </Badge>
    </Link>
  );
}
