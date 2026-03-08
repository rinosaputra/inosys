import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { AdminRBACFormCreate, adminRBACFormCreateOption } from '#/features/admin/rbac/admin-rbac-form-create'
import { useAdminRBACCreate } from '#/features/admin/rbac/admin-rbac-hooks'
import { adminRBACUrls } from '#/features/admin/rbac/admin-rbac-const'

const metadata: CreateMetaInput = {
  title: "Buat Pengguna Baru - RBAC",
  description: "Halaman untuk membuat pengguna baru di admin RBAC.",
  url: "/admin/rbac/create",
}

export const Route = createFileRoute('/(protected)/admin/rbac/create')({
  component: RouteComponent,
  head: () => createMeta(metadata),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { mutateAsync } = useAdminRBACCreate()
  const form = useAppForm({
    ...adminRBACFormCreateOption,
    onSubmit: ({ value }) => {
      // Handle form submission, e.g., send data to the server
      console.log('Form submitted with values:', value)
      toast.promise(mutateAsync(value), {
        loading: 'Creating user...',
        success: () => {
          navigate({
            to: adminRBACUrls.list
          })
          return 'User created successfully!'
        },
        error: (err) => err.message || 'Failed to create user',
      })
    }
  })

  return <AdminRBACFormCreate {...{
    form,
    title: metadata.title,
    description: metadata.description || ''
  }} />
}
