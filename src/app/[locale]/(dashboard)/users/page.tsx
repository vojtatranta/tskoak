import { searchParamsCache } from "@/web/lib/searchparams";
import { SearchParams } from "nuqs/parsers";
import React from "react";
import UsersListingPage from "./_components/users-listing-page";

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Dashboard : Users",
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <UsersListingPage />;
}
