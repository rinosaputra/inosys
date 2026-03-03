export type NavigationItem = {
  label: string
  to: string
  icon: string
  /** sembunyikan jika user tidak punya permission tertentu */
  requiredRoles?: string[]
  children?: NavigationItem[]
}
