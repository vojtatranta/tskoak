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
import SlidesTable from "./slides-tables";
import { getTranslations } from "next-intl/server";
import { OakUploadFrom } from "@/components/OakUploadFrom";

type TSlidesListingPage = {};

const createSlidesQuery = (
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
    .from("slides")
    .select("*", { count: params.count ? "exact" : undefined })
    .eq("user_id", params.user.id);

  if (filters.search) {
    baseQuery.ilike("text", `%${filters.search}%`);
  }

  return baseQuery
    .order("created_at", { ascending: false })
    .range(
      (Number(filters.page || 1) - 1) * Number(filters.limit || 10),
      Number(filters.page || 1) * Number(filters.limit || 10) - 1
    );
};

export default async function SlidesListingPage({}: TSlidesListingPage) {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  const [totalSlides, pageSlides, t] = await Promise.all([
    createSlidesQuery(
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
    createSlidesQuery(
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

  console.log("pageSlides", pageSlides);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`${t("slides.listing.title")}  (${totalSlides.count})`}
            description={t("slides.listing.description")}
          />

          <Link
            href={"/slides/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> {t("slides.listing.addNew")}
          </Link>
        </div>
        <OakUploadFrom refreshOnDone />
        <SlidesTable
          data={pageSlides.data ?? []}
          totalData={totalSlides.count ?? 0}
        />
      </div>
    </PageContainer>
  );
}
