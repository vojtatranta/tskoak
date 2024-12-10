"use client";

import { DataTable } from "@/web/components/ui/table/data-table";
import { DataTableResetFilter } from "@/web/components/ui/table/data-table-reset-filter";
import { DataTableSearch } from "@/web/components/ui/table/data-table-search";
import { Slide } from "@/web/lib/supabase-server";
import { useSlidesColumns } from "./columns";
import { useSlidesTableFilters } from "./use-presentations-table-filters";

export default function SlidesTable({
  data,
  totalData,
}: {
  data: Slide[];
  totalData: number;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchVector,
    searchVector,
    setSearchQuery,
  } = useSlidesTableFilters();

  const slidesColumns = useSlidesColumns();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
      <DataTable columns={slidesColumns} data={data} totalItems={totalData} />
    </div>
  );
}
