import z from "zod"

export const pageInputSchema = z.object({
  // Simpan di URL sebagai page/pageSize (lebih UX-friendly daripada offset)
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional().catch(undefined),

  sortBy: z.string().optional().catch(undefined),
  sortDirection: z.enum(["asc", "desc"]).optional().catch(undefined),
})

export type PageInput = z.infer<typeof pageInputSchema>

// helper: convert page -> offset
export function toOffset(input: PageInput) {
  return (input.page - 1) * input.pageSize
}
