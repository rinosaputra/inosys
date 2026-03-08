import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { UserWithRole } from 'better-auth/plugins'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { AdminRBACUpdateForm, adminRBACUpdateFormOption } from '#/features/admin/rbac/admin-rbac-update-form'
import { useAdminRBACUpdate } from '#/features/admin/rbac/admin-rbac-hooks'
import { adminRBACUrls } from '#/features/admin/rbac/admin-rbac-const'

const getMetadata = (id: string, user: UserWithRole): CreateMetaInput => ({
  title: `Edit ${user.name} - RBAC`,
  description: "Halaman untuk mengedit pengguna di admin RBAC.",
  url: adminRBACUrls.edit(id)
})

export const Route = createFileRoute('/(protected)/admin/rbac/$id/edit')({
  component: RouteComponent,
  head: ({ params: { id }, match }) => createMeta(getMetadata(id, match.context.user)),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { user } = Route.useRouteContext()
  const { id } = Route.useParams()
  const metadata = getMetadata(id, user)
  const { mutateAsync } = useAdminRBACUpdate()
  const form = useAppForm({
    ...adminRBACUpdateFormOption,
    onSubmit: ({ value }) => {
      toast.promise(mutateAsync(value), {
        loading: 'Updating user...',
        success: () => {
          navigate({
            to: adminRBACUrls.list
          })
          return 'User updated successfully!'
        },
        error: (err: Error) => err.message || 'Failed to create user',
      })
    }
  })

  return <AdminRBACUpdateForm {...{
    form,
    title: metadata.title,
    description: metadata.description || ''
  }} />
}
