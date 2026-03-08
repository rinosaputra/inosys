import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { FieldGroup } from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'

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
  subscribe: z.boolean(),
  notification: z.boolean(),
  plan: z.enum(['free', 'pro', 'enterprise'], 'Please select a plan'),
  addPackages: z.array(z.enum([
    'package-a',
    'package-b',
    'package-c',
  ])).min(1, 'Please select at least one package'),
})

type FormValues = z.infer<typeof FormSchema>

const FormDefaultValues: FormValues = {
  name: '',
  email: '',
  bio: '',
  gender: 'male',
  subscribe: false,
  plan: 'free',
  addPackages: [],
  notification: false,
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
    <Card>
      <CardHeader>
        <CardTitle>Example 1: Basic Form</CardTitle>
        <CardDescription>
          Contoh form sederhana dengan beberapa field (name, email, bio, gender) dan tombol submit/reset. Validasi menggunakan Zod schema.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <form.AppField name="subscribe">
              {(field) => (
                <field.CheckboxField
                  label="Subscribe to newsletter"
                  description="Get updates and news delivered to your inbox."
                />
              )}
            </form.AppField>
            <form.AppField name="plan">
              {(field) => (
                <field.RadioGroupField
                  label="Select Plan"
                  description="Choose the plan that best suits your needs."
                  options={[
                    { value: 'free', label: 'Free' },
                    { value: 'pro', label: 'Pro' },
                    { value: 'enterprise', label: 'Enterprise' },
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField name="addPackages">
              {(field) => (
                <field.MultipleCheckboxField
                  label="Additional Packages"
                  description="Select the additional packages you want to include."
                  options={[
                    { value: 'package-a', label: 'Package A' },
                    { value: 'package-b', label: 'Package B' },
                    { value: 'package-c', label: 'Package C' },
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField name="notification">
              {(field) => (
                <field.SwitchField
                  label="Enable Notifications"
                  description="Turn on to receive notifications about updates and offers."
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

        </form>
      </CardContent>
      <CardFooter>
        {submitted ? (
          <pre className="rounded-xl bg-muted p-4 text-xs overflow-auto">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        ) : null}
      </CardFooter>
    </Card>
  )
}
