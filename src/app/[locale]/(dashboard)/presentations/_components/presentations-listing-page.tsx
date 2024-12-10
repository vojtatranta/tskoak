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
import { getEmbeddings } from "@/lib/google-drive";

type TPresentationListingPage = {};

const performVectorSearch = async (
  query: string,
  supabase: SupabaseClient<Database>,
  params: {
    count?: boolean;
    page: number | undefined;
    limit: number | undefined;
    user: User;
  },
) => {
  const embedding = await getEmbeddings(query);

  const { data: presentationsMatcher } = await supabase.rpc(
    "match_presentations",
    {
      // @ts-expect-error: wrong supabase typing
      query_embedding: embedding, // Pass the embedding you want to compare
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 10, // Choose the number of matches
    },
  );

  const ids =
    presentationsMatcher?.map((presentation: any) => presentation.id) ?? [];

  console.log("tabormatcher:", presentationsMatcher);
  console.log("ids:", ids);
  const baseQuery = supabase
    .from("presentations")
    .select("*", { count: params.count ? "exact" : undefined })
    .eq("user_id", params.user.id)
    .in("id", ids);

  return baseQuery.order("created_at", { ascending: false });
};

const createPresentationsQuery = (
  supabase: SupabaseClient<Database>,
  filters: {
    page: number | undefined;
    limit: number | undefined;
    search?: string;
    vectorSearch?: string;
  },
  params: {
    user: User;
    count?: boolean;
  },
) => {
  if (filters.vectorSearch) {
    return performVectorSearch(filters.vectorSearch, supabase, {
      count: params.count,
      page: filters.page,
      limit: filters.limit,
      user: params.user,
    });
  }

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
  const vectorSearch = searchParamsCache.get("v") ?? "";
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
        vectorSearch,
      },
      {
        user,
        count: true,
      },
    ),
    createPresentationsQuery(
      supabase,
      {
        page: Number(page || 1),
        limit: Number(pageLimit || 10),
        search: search ?? "",
        vectorSearch,
      },
      {
        user,
      },
    ),
    getTranslations(),
  ]);

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
