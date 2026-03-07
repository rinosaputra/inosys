import { createFileRoute } from '@tanstack/react-router'

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

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

  return (<Card>
    <CardHeader>
      <CardTitle>{metadata.title}</CardTitle>
      <CardDescription>
        {metadata.description}
      </CardDescription>
    </CardHeader>
    <Separator />
    <CardContent>
    </CardContent>
    <Separator />
    <CardFooter></CardFooter>
  </Card>)
}
