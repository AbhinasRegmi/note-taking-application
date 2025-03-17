import { Skeleton } from "../ui/skeleton";

function CategoriesSkeleton() {
  return <Skeleton className="h-[25px] w-[50px] rounded-full" />;
}

export function CategoriesSkeletonList() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-wrap p-12 gap-8 max-w-lg justify-center">
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
        <CategoriesSkeleton />
      </div>
    </div>
  );
}
