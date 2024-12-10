"use client";

import { searchParams } from "@/web/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useSlidesTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1500 })
      .withDefault(""),
  );
  const [searchVector, setSearchVector] = useQueryState(
    "v",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1500 })
      .withDefault(""),
  );

  const [categoryId, setCategoryId] = useQueryState(
    "categoryId",
    searchParams.categoryId,
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoryId(null);
    setSearchVector(null);
    setPage(1);
  }, [setSearchQuery, setCategoryId, setSearchVector, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoryId || !!searchVector;
  }, [searchQuery, categoryId, searchVector]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    searchVector,
    setSearchVector,
    isAnyFilterActive,
  };
}
