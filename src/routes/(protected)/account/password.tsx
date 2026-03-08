import { createFileRoute } from '@tanstack/react-router'
import { formOptions } from '@tanstack/react-form'

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { useAppForm, withForm } from '#/integrations/tanstack-form/form-hook'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

import { UpdatePasswordSchema, type UpdatePasswordValues } from './-components/schema'
import { useAccountUpdatePassword } from './-components/hook'
import { PasswordInput } from '#/components/password'

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

const Form = withForm({
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
          <form.Field
            name="currentPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <FieldSeparator>New password</FieldSeparator>

          <form.Field
            name="newPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    showStrength
                    showStrengthFeedback
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="confirmNewPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm new password
                  </FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

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
  const form = useAppForm({
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
