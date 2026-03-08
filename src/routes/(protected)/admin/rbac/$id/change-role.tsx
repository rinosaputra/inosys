import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { AdminRBACChangeRoleForm, adminRBACChangeRoleFormOption } from '#/features/admin/rbac/admin-rbac-change-role-form'
import { useAdminRBACChangeRole } from '#/features/admin/rbac/admin-rbac-hooks'
import { adminRBACUrls } from '#/features/admin/rbac/admin-rbac-const'

const getMetadata = (id: string, name: string): CreateMetaInput => ({
  title: `Change Role ${name} - RBAC`,
  description: "Halaman untuk mengubah role pengguna di admin RBAC.",
  url: adminRBACUrls.changeRole(id)
})

export const Route = createFileRoute('/(protected)/admin/rbac/$id/change-role')({
  component: RouteComponent,
  head: async ({ params: { id }, match: { context } }) => createMeta(getMetadata(id, context.user.name))
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { user } = Route.useRouteContext()
  const { id } = Route.useParams()
  const metadata = getMetadata(id, user.name)
  const { mutateAsync } = useAdminRBACChangeRole()
  const form = useAppForm({
    ...adminRBACChangeRoleFormOption,
    onSubmit: ({ value }) => {
      toast.promise(mutateAsync({
        ...value,
        userId: id,
      }), {
        loading: 'Updating role user...',
        success: () => {
          navigate({
            to: adminRBACUrls.list
          })
          return 'Role user updated successfully!'
        },
        error: (err: Error) => err.message || 'Failed to change role user',
      })
    }
  })

  return <AdminRBACChangeRoleForm {...{
    form,
    title: metadata.title,
    description: metadata.description || ''
  }} />
}
