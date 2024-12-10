"use client";

import { searchParams } from "@/web/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo } from "react";

export function usePresentationsTableFilters() {
  const [vectorQuery, setVectorQuery] = useQueryState(
    "v",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
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

  useEffect(() => {
    if (vectorQuery) {
      setSearchQuery(null);
    }
  }, [vectorQuery]);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoryId(null);
    setVectorQuery(null);
    setPage(1);
  }, [setSearchQuery, setCategoryId, vectorQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoryId || !!vectorQuery;
  }, [searchQuery, categoryId, vectorQuery]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    vectorQuery,
    setVectorQuery,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
