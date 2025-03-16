import { Skeleton } from "../ui/skeleton";

export function NoteSkeleton() {
  return (
    <div className="flex flex-col space-y-3 min-w-sm border h-[250px] rounded-lg p-8">
      <Skeleton className="h-[20px] w-[150px]" />
      <Skeleton className="w-full h-[100px] mt-6" />
      <div className="flex gap-4 mt-6">
      <Skeleton className="h-[20px] w-[50px] rounded-full" />
      <Skeleton className="h-[20px] w-[50px] rounded-full" />
      <Skeleton className="h-[20px] w-[50px] rounded-full" />
      <Skeleton className="h-[20px] w-[50px] rounded-full" />
      </div>
    </div>
  );
}

export function NoteSkeletonList() {
  return (
    <div className="flex flex-wrap p-12 gap-8">
      <NoteSkeleton />
      <NoteSkeleton />
    </div>
  );
}
