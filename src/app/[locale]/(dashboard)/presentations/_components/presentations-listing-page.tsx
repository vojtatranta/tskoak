import PageContainer from "@/web/components/layout/page-container";
import { buttonVariants } from "@/web/components/ui/button";
import { Heading } from "@/web/components/ui/heading";
import { searchParamsCache } from "@/web/lib/searchparams";
import { cn } from "@/web/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  createSupabaseServerClient,
  getUser,
  User,
} from "@/web/lib/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import PresentationsTable from "./presentations-tables";
import { getTranslations } from "next-intl/server";
import { OakUploadFrom } from "@/components/OakUploadFrom";

type TPresentationListingPage = {};

const createPresentationsQuery = (
  supabase: SupabaseClient<Database>,
  filters: {
    page: number | undefined;
    limit: number | undefined;
    search?: string;
  },
  params: {
    user: User;
    count?: boolean;
  }
) => {
  const baseQuery = supabase
    .from("presentations")
    .select("*", { count: params.count ? "exact" : undefined })
    .eq("user_id", params.user.id);

  if (filters.search) {
    // baseQuery.ilike("title", `%${filters.search}%`);
    baseQuery.ilike("all_text", `%${filters.search}%`);
  }

  return baseQuery.order("created_at", { ascending: false });
};

export default async function PresentationsListingPage({}: TPresentationListingPage) {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  const [totalPresentations, pagePresentations, t] = await Promise.all([
    createPresentationsQuery(
      supabase,
      {
        page: Number(page || 1),
        limit: Number(pageLimit || 10),
        search: search ?? "",
      },
      {
        user,
        count: true,
      }
    ),
    createPresentationsQuery(
      supabase,
      {
        page: Number(page || 1),
        limit: Number(pageLimit || 10),
        search: search ?? "",
      },
      {
        user,
      }
    ),
    getTranslations(),
  ]);

  console.log("pagePresentations", pagePresentations);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${t("presentations.listing.title")}  (${
              totalPresentations.count
            })`}
            description={t("presentations.listing.description")}
          />

          <Link
            href={"/presentations/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" />{" "}
            {t("presentations.listing.addNew")}
          </Link>
        </div>
        <OakUploadFrom refreshOnDone />
        <PresentationsTable
          data={pagePresentations.data ?? []}
          totalData={totalPresentations.count ?? 0}
        />
      </div>
    </PageContainer>
  );
}
