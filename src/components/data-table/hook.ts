import { pageInputSchema, type PageInput } from "./schema"

export const useDataTableSearch = <T extends PageInput>(search: T) => {
  const parser = pageInputSchema.safeParse(search)

  return {
    page: parser.success ? parser.data.page : 1,
    pageSize: parser.success ? parser.data.pageSize : 10,
    search: parser.success ? parser.data.search : undefined,
    sortBy: parser.success ? parser.data.sortBy : undefined,
    sortDirection: parser.success ? parser.data.sortDirection : undefined,
  }
}
