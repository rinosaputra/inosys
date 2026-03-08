import { createFileRoute } from '@tanstack/react-router'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { AdminRBACFormCreate, adminRBACFormCreateOption } from '#/features/admin/rbac/admin-rbac-form-create'

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
  const form = useAppForm({
    ...adminRBACFormCreateOption,
    onSubmit: ({ value }) => {
      // Handle form submission, e.g., send data to the server
      console.log('Form submitted with values:', value)
    }
  })

  return <AdminRBACFormCreate {...{
    form,
    title: metadata.title,
    description: metadata.description || ''
  }} />
}
