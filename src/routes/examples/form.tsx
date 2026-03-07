import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { FieldGroup } from '#/components/ui/field'

export const Route = createFileRoute('/examples/form')({
  component: ExamplesFormsPage,
})

function ExamplesFormsPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1 className="m-0 text-2xl font-bold">Examples: Forms</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kumpulan contoh penggunaan TanStack Form + form composition (useAppForm
          + AppField) dengan UI shadcn.
        </p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FormExample />
      </div>
    </main>
  )
}

/**
 * Example 1: Basic "TextField" usage.
 * - Menunjukkan cara pakai form.AppField + field.TextField (pre-bound).
 * - Menunjukkan handle submit (tanpa server call).
 */

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be less than 500 characters'),
  gender: z.enum(['male', 'female'], 'Please select a gender'),
})

type FormValues = z.infer<typeof FormSchema>

const FormDefaultValues: FormValues = {
  name: '',
  email: '',
  bio: '',
  gender: '',
}

function FormExample() {
  const [submitted, setSubmitted] = useState<FormValues | undefined>(undefined)

  const form = useAppForm({
    defaultValues: FormDefaultValues,
    validators: { onSubmit: FormSchema },
    onSubmit: async ({ value }) => {
      // Simulasi submit
      setSubmitted(value)
    },
  })

  return (
    <section className="island-shell rounded-2xl p-6">
      <h2 className="m-0 text-lg font-semibold">Basic form</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Contoh minimal untuk TextField.
      </p>

      <form
        className="mt-5 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label="Name"
                placeholder="Your name"
                autoComplete="name"
              />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
              />
            )}
          </form.AppField>
          <form.AppField name="bio">
            {(field) => (
              <field.TextareaField
                label="Bio"
                placeholder="Write something..."
                rows={5}
              />
            )}
          </form.AppField>
          <form.AppField name="gender">
            {(field) => (
              <field.SelectField
                label="Gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
              />
            )}
          </form.AppField>
        </FieldGroup>

        <div className="flex items-center gap-3">
          <form.AppForm>
            <form.SubmitForm
              label="Submit"
              loadingLabel="Submitting..."
            />
            <form.ResetForm />
          </form.AppForm>
        </div>

        {submitted ? (
          <pre className="rounded-xl bg-muted p-4 text-xs overflow-auto">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        ) : null}
      </form>
    </section>
  )
}
