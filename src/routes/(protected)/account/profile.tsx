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
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

const metadata: CreateMetaInput = {
  title: 'Profile Settings',
  description: 'Manage your profile information including your display name and avatar URL. This information will be visible to others when you interact on the platform.',
}

export const Route = createFileRoute('/(protected)/account/profile')({
  component: AccountProfilePage,
})

const Schema = z.object({
  name: z.string().min(1, 'Name is required.'),
  avatarUrl: z
    .url('Avatar must be a valid URL.')
    .or(z.literal('')),
})

function AccountProfilePage() {
  const { auth: { user } } = Route.useRouteContext()

  const form = useForm({
    validators: { onSubmit: Schema },
    defaultValues: {
      name: user.name ?? '',
      avatarUrl: user.image ?? '',
    },
    async onSubmit({ value }) {
      // TODO(feat): serverFn update profile (Prisma) + toast
      console.log('update profile', value)
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
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Your full name"
                      autoComplete="name"
                      type="text"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="avatarUrl"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Avatar URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://..."
                      autoComplete="off"
                      type="url"
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
            <Button type="submit">Save profile</Button>
          </Field>
        </CardFooter>
      </Card>
    </form>
  )
}
