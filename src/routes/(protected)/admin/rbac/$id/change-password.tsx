import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { AdminRBACChangePasswordForm, adminRBACChangePasswordFormOption } from '#/features/admin/rbac/admin-rbac-change-password-form'
import { useAdminRBACChangePassword } from '#/features/admin/rbac/admin-rbac-hooks'
import { adminRBACUrls } from '#/features/admin/rbac/admin-rbac-const'

const getMetadata = (id: string, name: string): CreateMetaInput => ({
  title: `Change Password ${name} - RBAC`,
  description: "Halaman untuk mengubah password pengguna di admin RBAC.",
  url: adminRBACUrls.changePassword(id)
})

export const Route = createFileRoute('/(protected)/admin/rbac/$id/change-password')({
  component: RouteComponent,
  head: async ({ params: { id }, match: { context } }) => createMeta(getMetadata(id, context.user.name))
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { user } = Route.useRouteContext()
  const { id } = Route.useParams()
  const metadata = getMetadata(id, user.name)
  const { mutateAsync } = useAdminRBACChangePassword()
  const form = useAppForm({
    ...adminRBACChangePasswordFormOption,
    onSubmit: ({ value }) => {
      toast.promise(mutateAsync({
        ...value,
        userId: id,
      }), {
        loading: 'Updating password user...',
        success: () => {
          navigate({
            to: adminRBACUrls.list
          })
          return 'Password user updated successfully!'
        },
        error: (err: Error) => err.message || 'Failed to change password user',
      })
    }
  })

  return <AdminRBACChangePasswordForm {...{
    form,
    title: metadata.title,
    description: metadata.description || ''
  }} />
}
