import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '#/integrations/tanstack-form/form-hook'
import { FieldGroup } from '#/components/ui/field'
import { Button } from '#/components/ui/button'

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
        <BasicFormExample />
        <TextareaExample />
      </div>
    </main>
  )
}

/**
 * Example 1: Basic "TextField" usage.
 * - Menunjukkan cara pakai form.AppField + field.TextField (pre-bound).
 * - Menunjukkan handle submit (tanpa server call).
 */

const BasicFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
})

type BasicFormValues = z.infer<typeof BasicFormSchema>

const BasicFormDefaultValues: BasicFormValues = {
  name: '',
  email: '',
}

function BasicFormExample() {
  const [submitted, setSubmitted] = useState<BasicFormValues | undefined>(undefined)

  const form = useAppForm({
    defaultValues: BasicFormDefaultValues,
    validators: { onSubmit: BasicFormSchema },
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
        </FieldGroup>

        <div className="flex items-center gap-3">
          <form.AppForm>
            <form.SubmitForm
              label="Submit"
            />
            <form.ResetForm
              label="Reset"
            />
          </form.AppForm>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset()
            }}
          >
            Reset
          </Button>
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

/**
 * Example 2: Textarea usage.
 * - Menunjukkan field.TextareaField (pre-bound).
 */

const TextareaFormSchema = z.object({
  bio: z.string().min(1, 'Bio is required'),
})

type TextareaFormValues = z.infer<typeof TextareaFormSchema>

const TextareaFormDefaultValues: TextareaFormValues = {
  bio: '',
}

function TextareaExample() {
  const [submitted, setSubmitted] = useState<TextareaFormValues | undefined>(undefined)

  const form = useAppForm({
    defaultValues: TextareaFormDefaultValues,
    validators: { onSubmit: TextareaFormSchema },
    onSubmit: async ({ value }) => {
      setSubmitted(value)
    },
  })

  return (
    <section className="island-shell rounded-2xl p-6">
      <h2 className="m-0 text-lg font-semibold">Textarea form</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Contoh penggunaan TextareaField.
      </p>

      <form
        className="mt-5 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.AppField name="bio">
            {(field) => (
              <field.TextareaField
                label="Bio"
                placeholder="Write something..."
                rows={5}
              />
            )}
          </form.AppField>
        </FieldGroup>

        <div className="flex items-center gap-3">
          <form.AppForm>
            <form.SubmitForm
              label="Submit"
            />
          </form.AppForm>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset()
              setSubmitted(undefined)
            }}
          >
            Reset
          </Button>
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
