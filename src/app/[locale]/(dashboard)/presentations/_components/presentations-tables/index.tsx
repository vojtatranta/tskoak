"use client";

import { DataTable } from "@/web/components/ui/table/data-table";
import { DataTableResetFilter } from "@/web/components/ui/table/data-table-reset-filter";
import { DataTableSearch } from "@/web/components/ui/table/data-table-search";
import { Presentation } from "@/web/lib/supabase-server";
import { usePresentationsColumns } from "./columns";
import { usePresentationsTableFilters } from "./use-presentations-table-filters";
import { useTranslations } from "next-intl";

export default function PresentationsTable({
  data,
  totalData,
}: {
  data: Presentation[];
  totalData: number;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    vectorQuery,
    setVectorQuery,
    setSearchQuery,
  } = usePresentationsTableFilters();

  const presentationsColumns = usePresentationsColumns();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableSearch
          searchKey="vector"
          searchQuery={vectorQuery}
          setSearchQuery={setVectorQuery}
          setPage={setPage}
        />
        {/* <DataTableFilterBox
          filterKey="gender"
          title="Gender"
          options={GENDER_OPTIONS}
          setFilterValue={setGenderFilter}
          filterValue={genderFilter}
        /> */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable
        columns={presentationsColumns}
        data={data}
        totalItems={totalData}
      />
    </div>
  );
}
