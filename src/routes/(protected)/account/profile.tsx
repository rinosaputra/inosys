import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

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
    <div>
      <h2 className="m-0 text-xl font-semibold">
        Profile
      </h2>
      <p className="mt-2 text-sm">
        Update your name and avatar URL.
      </p>

      <form
        className="mt-5 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
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

          <Field>
            <Button type="submit">Save profile</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
