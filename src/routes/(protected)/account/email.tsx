import { createFileRoute } from '@tanstack/react-router'
import { formOptions } from '@tanstack/react-form'

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import {
  Field,
  FieldGroup,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

import { UpdateEmailSchema, type UpdateEmailValues } from './-components/schema'
import { useAccountUpdateEmail } from './-components/hook'
import { useAppFormAccount, withFormAccount } from './-components/form-hook'

const metadata: CreateMetaInput = {
  title: 'Email Settings',
  description: 'Manage your email address and notification preferences. Update your email to receive important updates and notifications from the platform.',
}

export const Route = createFileRoute('/(protected)/account/email')({
  component: AccountEmailPage,
  head: () => createMeta(metadata),
})

const defaultValues: UpdateEmailValues = {
  email: '',
}

const formOpts = formOptions({
  validators: { onSubmit: UpdateEmailSchema },
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
          {/* Email Field */}
          <form.AppField name="email">
            {({ TextField }) => <TextField
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              type="email"
            />}
          </form.AppField>
        </FieldGroup>
      </CardContent>
      <Separator />
      <CardFooter>
        <Field>
          <form.AppForm>
            <form.SubmitForm
              label="Update email"
              loadingLabel="Updating..."
            />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  </form>
})

function AccountEmailPage() {
  const { auth } = Route.useRouteContext()
  const { updateEmail } = useAccountUpdateEmail()

  const form = useAppFormAccount({
    ...formOpts,
    defaultValues: {
      email: auth?.user?.email ?? '',
    },
    async onSubmit({ value }) {
      console.log('update email', value)
      updateEmail(value)
    },
  })

  return <Form form={form} />
}
