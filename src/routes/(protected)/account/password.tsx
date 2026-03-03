import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import z from 'zod'
import type { CreateMetaInput } from '#/lib/seo'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { PasswordInput } from '#/components/password'
import { passwordSchema } from '#/components/password/schema'

const metadata: CreateMetaInput = {
  title: 'Password Settings',
  description: 'Manage your password settings. Update your password regularly to keep your account secure.',
}

export const Route = createFileRoute('/(protected)/account/password')({
  component: AccountPasswordPage,
})

const Schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  })

function AccountPasswordPage() {
  const form = useForm({
    validators: { onSubmit: Schema },
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    async onSubmit({ value }) {
      // TODO(feat): serverFn change password (Better Auth) + toast
      console.log('change password', value)
    },
  })

  return (
    <form
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
            <Button type="submit">Update password</Button>
          </Field>
        </CardFooter>
      </Card>
    </form>
  )
}
