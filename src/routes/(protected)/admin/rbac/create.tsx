import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { AdminRBACCreateForm, adminRBACCreateFormOption } from '#/features/admin/rbac/admin-rbac-create-form'
import { useAdminRBACCreate } from '#/features/admin/rbac/admin-rbac-hooks'
import { adminRBACUrls } from '#/features/admin/rbac/admin-rbac-const'

const metadata: CreateMetaInput = {
  title: "Buat Pengguna Baru - RBAC",
  description: "Halaman untuk membuat pengguna baru di admin RBAC.",
  url: adminRBACUrls.create,
}

export const Route = createFileRoute('/(protected)/admin/rbac/create')({
  component: RouteComponent,
  head: () => createMeta(metadata),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { mutateAsync } = useAdminRBACCreate()
  const form = useAppForm({
    ...adminRBACCreateFormOption,
    onSubmit: ({ value }) => {
      toast.promise(mutateAsync(value), {
        loading: 'Creating user...',
        success: () => {
          navigate({
            to: adminRBACUrls.list
          })
          return 'User created successfully!'
        },
        error: (err: Error) => err.message || 'Failed to create user',
      })
    }
  })

  return <AdminRBACCreateForm {...{
    form,
    title: metadata.title,
    description: metadata.description || ''
  }} />
}
