"use client";
import { Checkbox } from "@/web/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { CopyableText } from "@/web/components/CopyableText";
import { Presentation } from "@/web/lib/supabase-server";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { RedirectImage } from "@/components/RedirectImage";

export const usePresentationsColumns = (): ColumnDef<Presentation>[] => {
  const t = useTranslations();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("common.selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("common.selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("common.table.id"),
    },
    {
      accessorKey: "thumbnail_url",
      header: t("common.table.thumbnail"),
      cell: ({ row }) => {
        const data = row.original;
        return data.thumbnail_url ? (
          <RedirectImage
            alt="presentation thumbnail"
            src={data.thumbnail_url}
            className="h-10 w-10 rounded-md"
          />
        ) : (
          "N/A"
        );
      },
    },
    {
      accessorKey: "title",
      header: t("common.table.title"),
    },
    {
      accessorKey: "all_text",
      header: t("common.table.texts"),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div>
            {data.all_text?.substring(0, 200)}
            {(data.all_text?.length ?? 0) > 200 && "..."}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];
};
