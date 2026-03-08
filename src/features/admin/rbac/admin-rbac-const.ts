import type { Role } from "#/integrations/better-auth/rbac/permission";

export const adminRBACUrls = {
  list: '/admin/rbac',
  create: '/admin/rbac/create',
  edit: (id: string) => `/admin/rbac/${id}/edit`,
}

export const adminRBACRoleOptions: {
  value: Role,
  label: string,
  description: string,
}[] = [
    {
      value: 'superadmin',
      label: 'Super Admin',
      description: 'Memiliki akses penuh ke semua fitur dan pengaturan. Dapat mengelola admin lain, termasuk admin dengan peran superadmin.',
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Memiliki akses ke sebagian besar fitur dan pengaturan, tetapi tidak dapat mengelola admin dengan peran superadmin.',
    },
    {
      value: 'member',
      label: 'Member',
      description: 'Memiliki akses terbatas, biasanya hanya dapat melihat data tertentu tanpa kemampuan untuk mengubah pengaturan atau mengelola pengguna lain.',
    }
  ]
