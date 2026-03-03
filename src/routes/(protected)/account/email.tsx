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
  title: 'Email Settings',
  description: 'Manage your email address and notification preferences. Update your email to receive important updates and notifications from the platform.',
}

export const Route = createFileRoute('/(protected)/account/email')({
  component: AccountEmailPage,
})

const Schema = z.object({
  email: z.email('Please enter a valid email address.'),
})

function AccountEmailPage() {
  const { auth } = Route.useRouteContext()

  const form = useForm({
    validators: { onSubmit: Schema },
    defaultValues: {
      email: auth?.user?.email ?? '',
    },
    async onSubmit({ value }) {
      // TODO(feat): serverFn update email (Better Auth) + toast
      console.log('update email', value)
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
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="you@example.com"
                        autoComplete="email"
                        type="email"
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
              <Button type="submit">Update email</Button>
            </Field>
          </CardFooter>
        </Card>
      </form>
  )
}
