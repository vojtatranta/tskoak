import {
  createSearchParamsCache,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const BASE_PAGE_LIMIT = 50;

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(BASE_PAGE_LIMIT),
  q: parseAsString,
  categoryId: parseAsInteger,
  quizId: parseAsString,
  test: parseAsBoolean.withDefault(false),
  gender: parseAsString,
  categories: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
