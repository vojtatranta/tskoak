import { searchParamsCache } from "@/web/lib/searchparams";
import { SearchParams } from "nuqs/parsers";
import React from "react";
import PresentationsListingPage from "./_components/presentations-listing-page";

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Dashboard : Product Attributes",
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <PresentationsListingPage />;
}
