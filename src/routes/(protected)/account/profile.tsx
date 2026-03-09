import { createFileRoute } from '@tanstack/react-router'
import { formOptions } from '@tanstack/react-form'

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import {
  Field,
  FieldGroup,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

import { UpdateProfileSchema, type UpdateProfileValues } from './-components/schema'
import { useAccountUpdateProfile } from './-components/hook'
import { useAppFormAccount, withFormAccount } from './-components/form-hook'

const metadata: CreateMetaInput = {
  title: 'Profile Settings',
  description: 'Manage your profile information including your display name and avatar URL. This information will be visible to others when you interact on the platform.',
}

export const Route = createFileRoute('/(protected)/account/profile')({
  component: AccountProfilePage,
  head: () => createMeta(metadata),
})

const defaultValues: UpdateProfileValues = {
  name: '',
  avatarUrl: '',
}

const formOpts = formOptions({
  validators: { onSubmit: UpdateProfileSchema },
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
          {/* Name Field */}
          <form.AppField name="name">
            {({ TextField }) => <TextField
              label="Name"
              placeholder="Your full name"
              autoComplete="name"
              type="text"
            />}
          </form.AppField>
          {/* Avatar URL Field */}
          <form.AppField name="avatarUrl">
            {({ TextField }) => <TextField
              label="Avatar URL"
              placeholder="https://..."
              autoComplete="off"
              type="url"
            />}
          </form.AppField>
        </FieldGroup>
      </CardContent>
      <Separator />
      <CardFooter>
        <Field>
          <form.AppForm>
            <form.SubmitForm
              label="Save profile"
              loadingLabel="Saving..."
            />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  </form>,
})

function AccountProfilePage() {
  const { auth: { user } } = Route.useRouteContext()
  const { updateProfile } = useAccountUpdateProfile()

  const form = useAppFormAccount({
    ...formOpts,
    defaultValues: {
      name: user.name ?? '',
      avatarUrl: user.image ?? '',
    },
    async onSubmit({ value }) {
      updateProfile(value)
    },
  })

  return <Form form={form} />
}
