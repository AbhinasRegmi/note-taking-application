import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRefetchContext } from "./provider";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export function FilterNotes() {
  const data = useRefetchContext();
  const [sortOrder, setSortOrder] = useState(data.sortOrder);
  const [orderBy, setOrderBy] = useState(data.orderBy);

  useEffect(() => {
    data.setSearchParams({
      search: data.search ?? "",
      sortOrder: sortOrder ?? "desc",
      orderBy: orderBy ?? "updatedAt",
      page: data.page ?? 0,
    });
  }, [sortOrder, orderBy]);

  return (
    <DropdownMenu>
      <Button asChild variant={"ghost"} size={"sm"} className="rounded-md">
        <DropdownMenuTrigger>
          <Filter />
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent className="mr-8 w-56">
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Order By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={orderBy} onValueChange={setOrderBy}>
          <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="createdAt">
            CreatedAt
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="updatedAt">
            UpdatedAt
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SearchNotes() {
  const data = useRefetchContext();
  const [searchValue, setSearchValue] = useState(data.search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      data.setSearchParams({
        search: searchValue ?? "",
        sortOrder: data.sortOrder,
        orderBy: data.orderBy,
        page: data.page ?? 0,
      });
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <Input
      className="max-w-xs"
      value={searchValue}
      onChange={(e) => setSearchValue(e.currentTarget.value)}
      placeholder="Search notes..."
    />
  );
}
