import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/src/app/[locale]/(dashboard)/kanban/_components/board-column";
import { TaskDragData } from "@/src/app/[locale]/(dashboard)/kanban/_components/task-card";
import { PlanWithProduct } from "./stripe";

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export const formatPlanPrice = (
  amount: string,
  currency: string = "CZK",
  options: { locale?: string } = {
    locale: "cs-CZ",
  },
) => {
  const price = parseFloat(
    (parseFloat(amount) / 100).toFixed(2).replace(".", ","),
  );
  return new Intl.NumberFormat(options.locale ?? "cs-CZ", {
    style: "currency",
    currency,
  }).format(price);
};

export const getPlanRange = (
  plan: PlanWithProduct,
): { from: number; to: number } | null => {
  const borderLines = {
    from: plan.product.metadata?.["from"] ?? null,
    to: plan.product.metadata?.["to"] ?? null,
  };

  if (!borderLines.from || !borderLines.to) {
    return null;
  }

  return {
    from: Number(borderLines.from),
    to: Number(borderLines.to),
  };
};
