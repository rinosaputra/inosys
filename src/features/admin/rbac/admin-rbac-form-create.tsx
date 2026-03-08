import { formOptions } from "@tanstack/react-form"

import { withForm } from "#/integrations/tanstack-form/form-hook"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#/components/ui/card"
import { Separator } from "#/components/ui/separator"

import { AdminRBACCreateSchema, type AdminRBACCreate } from "./admin-rbac-schema"
import { adminRBACRoleOptions, adminRBACUrls } from "./admin-rbac-const"
import { Button } from "#/components/ui/button"
import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

const defaultValues: AdminRBACCreate = {
  name: '',
  email: '',
  role: 'member',
  password: '',
}

export const adminRBACFormCreateOption = formOptions({
  defaultValues,
  validators: { onSubmit: AdminRBACCreateSchema }
})

export const AdminRBACFormCreate = withForm({
  ...adminRBACFormCreateOption,
  props: {
    title: "Buat Pengguna Baru - RBAC",
    description: "Form untuk membuat pengguna baru di admin RBAC."
  },
  render: ({ form, title, description }) => <form onSubmit={(e) => {
    e.preventDefault()
    form.handleSubmit()
  }}>
    <Card>
      <CardHeader>
        <div>
          <Button asChild variant="link" size="sm">
            <Link to={adminRBACUrls.list}>
              <ArrowLeft />
              Kembali
            </Link>
          </Button>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
        {/* Name Field */}
        <form.AppField name="name">{({ TextField }) => <TextField
          label="Name"
        />}</form.AppField>
        {/* Email Field */}
        <form.AppField name="email">{({ TextField }) => <TextField
          label="Email"
          type="email"
          description="Pastikan email yang dimasukkan valid dan belum digunakan oleh pengguna lain."
        />}</form.AppField>
        {/* Password Field */}
        <form.AppField name="password">{({ TextField }) => <TextField
          label="Password"
          type="password"
        />}</form.AppField>
        {/* Role Field */}
        <form.AppField name="role">{({ RadioGroupField }) => <RadioGroupField
          label="Role"
          options={adminRBACRoleOptions}
        />}</form.AppField>
      </CardContent>
      <Separator />
      <CardFooter>
        <form.AppForm>
          <form.SubmitForm
            label="Buat Pengguna"
            loadingLabel="Membuat..."
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  </form>
})
