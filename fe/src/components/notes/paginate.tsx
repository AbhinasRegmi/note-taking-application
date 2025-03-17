import { useEffect, useState } from "react";
import { useRefetchContext } from "../search/notes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export function PaginateNotes() {
  const data = useRefetchContext();
  const [pageNumber, setPageNumber] = useState(data.page);

  useEffect(() => {
    if (Number(pageNumber) >= 0) {
      data.setSearchParams({
        search: data.search ?? "",
        sortOrder: data.sortOrder ?? "desc",
        orderBy: data.orderBy ?? "updatedAt",
        page: pageNumber,
      });
    }
  }, [pageNumber]);

  return (
    <div className="pt-12">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                setPageNumber((i) => {
                  let num = Number(i);
                  if (num > 0) {
                    num -= 1;
                    return num.toString();
                  }

                  return i;
                })
              }
            />
          </PaginationItem>
          <span className="p-0.5"></span>
        </PaginationContent>
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setPageNumber((i) => {
                let num = Number(i);
                if (num >= 0) {
                  num += 1;
                  return num.toString();
                }

                return i;
              })
            }
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
}
