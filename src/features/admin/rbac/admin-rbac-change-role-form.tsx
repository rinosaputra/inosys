import { formOptions } from "@tanstack/react-form"
import { ArrowLeft } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { withForm } from "#/integrations/tanstack-form/form-hook"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#/components/ui/card"
import { Separator } from "#/components/ui/separator"
import { Button } from "#/components/ui/button"

import { AdminRBACChangeRoleSchema, type AdminRBACChangeRole } from "./admin-rbac-schema"
import { adminRBACRoleOptions, adminRBACUrls } from "./admin-rbac-const"

const defaultValues: AdminRBACChangeRole = {
  role: 'member'
}

export const adminRBACChangeRoleFormOption = formOptions({
  defaultValues,
  validators: { onSubmit: AdminRBACChangeRoleSchema }
})

export const AdminRBACChangeRoleForm = withForm({
  ...adminRBACChangeRoleFormOption,
  props: {
    title: "Edit Pengguna - RBAC",
    description: "Form untuk mengedit pengguna di admin RBAC."
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
        <Separator className="mb-4" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
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
            label="Ubah Role"
            loadingLabel="Menyimpan..."
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  </form>
})
