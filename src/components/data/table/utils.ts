export const getDataTableQueryKey = <T>(name: T, ...props: unknown[]) => {
  return ["data-table", name, ...props] as const
}
