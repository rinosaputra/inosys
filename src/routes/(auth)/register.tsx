import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { formOptions } from "@tanstack/react-form"
import { toast } from "sonner";

import { createMeta, type CreateMetaInput } from "#/lib/seo";
import { AUTH_IS_AUTH_URL, SITE_TITLE, SITE_URL } from "#/lib/site";
import { authClient } from "#/lib/auth-client";
import { useAppForm, withForm } from "#/integrations/tanstack-form/form-hook";

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { PasswordInput } from "#/components/password";
import { passwordConfirmationSchema } from "#/components/password/schema";

const metadata: CreateMetaInput = {
  title: `Register - ${SITE_TITLE}`,
  description: `Register for a ${SITE_TITLE} account to access your dashboard and manage your settings.`,
  url: `${SITE_URL}/register`,
  ogType: "website",
  twitterCard: "summary_large_image",
}

export const Route = createFileRoute("/(auth)/register")({
  component: RegisterPage,
  head: () => createMeta(metadata),
});

const RegisterSchema = z
  .object({
    name: z.string().nonempty("Please enter your name."),
    email: z.email("Please enter a valid email address.")
  })
  .and(passwordConfirmationSchema)

type RegisterValues = z.infer<typeof RegisterSchema>

const defaultValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const RegisterFormOptions = formOptions({
  defaultValues,
  validators: {
    onSubmit: RegisterSchema,
  },
})

const RegisterForm = withForm({
  ...RegisterFormOptions,
  render: ({ form }) => <>
    {/* Name Input */}
    <form.AppField name="name">
      {({ TextField }) => <TextField
        label="Name"
        placeholder="Enter your name"
        autoComplete="off"
        type="text"
      />}
    </form.AppField>
    {/* Email Input */}
    <form.AppField name="email">
      {({ TextField }) => <TextField
        label="Email"
        placeholder="Enter your email"
        autoComplete="off"
        type="email"
      />}
    </form.AppField>
    {/* Password Input */}
    <form.Field
      name="password"
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <PasswordInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={isInvalid}
              placeholder="Enter your password"
              autoComplete="off"
              showStrength
              showStrengthFeedback
            />
            {isInvalid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )
      }}
    />
    {/* Confirm Password Input */}
    <form.Field
      name="confirmPassword"
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
            <PasswordInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={isInvalid}
              placeholder="Confirm your password"
              autoComplete="off"
            />
            {isInvalid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )
      }}
    />
    <Field>
      <form.AppForm>
        <form.SubmitForm
          label="Register"
          loadingLabel="Registering..."
        />
      </form.AppForm>
    </Field>
  </>
})

function RegisterPage() {
  const navigate = Route.useNavigate()
  const form = useAppForm({
    ...RegisterFormOptions,
    onSubmit({ value }) {
      toast.promise(
        async () => {
          const response = await authClient.signUp.email({
            name: value.name,
            email: value.email,
            password: value.password,
          })
          if (response.error) {
            throw new Error(response.error.message)
          }
          return response
        },
        {
          loading: "Registering...",
          success: () => {
            navigate({
              to: AUTH_IS_AUTH_URL
            })
            return "Register successful!"
          },
          error: e => {
            return e instanceof Error ? e.message : "An error occurred during register."
          },
        }
      )
    }
  })

  return (<form className="flex flex-col gap-6" onSubmit={e => {
    e.preventDefault()
    form.handleSubmit()
  }}>
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">
          Welcome to {SITE_TITLE}
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email and password to create your account.
        </p>
      </div>
      <RegisterForm form={form} />
      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <Button variant="outline" type="button">
          Register with Google
        </Button>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          {/* @ts-ignore */}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>)
}
