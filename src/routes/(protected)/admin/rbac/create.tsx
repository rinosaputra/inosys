import { createFileRoute } from '@tanstack/react-router'
import { useForm } from "@tanstack/react-form"

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { AdminRBACCreateSchema, type AdminRBACCreate } from '#/features/admin/rbac/admin-rbac-schema'

const metadata: CreateMetaInput = {
  title: "Buat Pengguna Baru - RBAC",
  description: "Halaman untuk membuat pengguna baru di admin RBAC.",
  url: "/admin/rbac/create",
}

export const Route = createFileRoute('/(protected)/admin/rbac/create')({
  component: RouteComponent,
  head: () => createMeta(metadata),
})

const defaultValues: AdminRBACCreate = {
  name: '',
  email: '',
  password: '',
  role: 'member',
}

function RouteComponent() {
  const form = useForm({
    validators: {
      onSubmit: AdminRBACCreateSchema
    },
    defaultValues,
    onSubmit: ({ value }) => {
      // Handle form submission, e.g., send data to the server
      console.log('Form submitted with values:', value)
    }
  })

  return (<Card>
    <CardHeader>
      <CardTitle>{metadata.title}</CardTitle>
      <CardDescription>
        {metadata.description}
      </CardDescription>
    </CardHeader>
    <Separator />
    <CardContent>
      <form>
        {/* Form fields for creating a new user would go here */}
      </form>
    </CardContent>
    <Separator />
    <CardFooter></CardFooter>
  </Card>)
}
