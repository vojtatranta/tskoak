"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSearch,
  SelectTrigger,
  SelectValue,
} from "@/web/components/ui/select";
import { FormControl } from "./ui/form";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useSupabase } from "@/web/lib/supabase-client";
import { useCallback, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

const NO_PRODUCT_CATEGORY_VALUE = "no-product-category" as const;

export function ProductCategoriesSelect({
  onChange,
  value,
  userId,
}: {
  userId: string;
  value: string | null | undefined;
  onChange: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = useSupabase();
  const { data } = useQuery(
    supabase
      .from("product_categories")
      .select("*")
      .eq("user", userId)
      .order("name", {
        ascending: true,
      }),
  );

  const handleChange = useCallback(
    (id: string) => {
      if (id !== NO_PRODUCT_CATEGORY_VALUE) {
        onChange(id);
      }
    },
    [onChange],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  return (
    <Select
      onValueChange={handleChange}
      value={value ?? NO_PRODUCT_CATEGORY_VALUE}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a product category" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectSearch
          autoFocus
          placeholder="Search for a product category"
          onChange={handleSearchChange}
        />
        <ScrollArea className="h-[200px]">
          <SelectItem disabled value={NO_PRODUCT_CATEGORY_VALUE}>
            No product category
          </SelectItem>
          {data
            ?.filter(
              (productCategory) =>
                productCategory.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            )
            .map((productCategory) => (
              <SelectItem
                key={productCategory.id}
                value={String(productCategory.id)}
              >
                {productCategory.name} : {String(productCategory.id)}
              </SelectItem>
            ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
