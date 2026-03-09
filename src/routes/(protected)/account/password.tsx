import { createFileRoute } from '@tanstack/react-router'
import { formOptions } from '@tanstack/react-form'

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import {
  Field,
  FieldGroup,
  FieldSeparator,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

import { UpdatePasswordSchema, type UpdatePasswordValues } from './-components/schema'
import { useAccountUpdatePassword } from './-components/hook'
import { useAppFormAccount, withFormAccount } from './-components/form-hook'

const metadata: CreateMetaInput = {
  title: 'Password Settings',
  description: 'Manage your password settings. Update your password regularly to keep your account secure.',
}

export const Route = createFileRoute('/(protected)/account/password')({
  component: AccountPasswordPage,
  head: () => createMeta(metadata),
})

const defaultValues: UpdatePasswordValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

const formOpts = formOptions({
  validators: { onSubmit: UpdatePasswordSchema },
  defaultValues,
})

const Form = withFormAccount({
  ...formOpts,
  render: ({ form }) => <form
    className="mt-5 flex flex-col gap-6"
    onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}
  >
    <Card>
      <CardHeader>
        <CardTitle>{metadata.title}</CardTitle>
        <CardDescription>
          {metadata.description}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <FieldGroup>
          {/* Current Password Field */}
          <form.AppField name="currentPassword">
            {({ PasswordField }) => <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              autoComplete="current-password"
            />}
          </form.AppField>

          <FieldSeparator>New password</FieldSeparator>

          {/* New Password Field */}
          <form.AppField name="newPassword">
            {({ PasswordField }) => <PasswordField
              label="New Password"
              placeholder="Enter new password"
              autoComplete="new-password"
              showStrength
              showStrengthFeedback
            />}
          </form.AppField>

          {/* Confirm New Password Field */}
          <form.AppField name="confirmNewPassword">
            {({ PasswordField }) => <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />}
          </form.AppField>
        </FieldGroup>
      </CardContent>
      <Separator />
      <CardFooter>
        <Field>
          <form.AppForm>
            <form.SubmitForm
              label="Update password"
              loadingLabel="Updating..."
            />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  </form>
})

function AccountPasswordPage() {
  const { updatePassword } = useAccountUpdatePassword()
  const form = useAppFormAccount({
    validators: { onSubmit: UpdatePasswordSchema },
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    async onSubmit({ value }) {
      updatePassword(value)
    },
  })

  return <Form form={form} />
}
