import { searchParamsCache } from "@/web/lib/searchparams";
import { SearchParams } from "nuqs/parsers";
import React from "react";
import SlidesListingPage from "./_components/slides-listing-page";

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Dashboard : Slides",
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <SlidesListingPage />;
}
