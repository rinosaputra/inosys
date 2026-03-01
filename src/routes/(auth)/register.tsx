import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createMeta, type CreateMetaInput } from "#/lib/seo";
import { SITE_TITLE, SITE_URL } from "#/lib/site";
import { PasswordInput } from "#/components/password";
import { toast } from "sonner";
import { authClient } from "#/lib/auth-client";
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

const RegisterSchema = z.object({
  name: z.string().nonempty("Please enter your name."),
  email: z.email("Please enter a valid email address.")
}).and(passwordConfirmationSchema)

function RegisterPage() {
  const form = useForm({
    validators: {
      onSubmit: RegisterSchema
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit({ value }) {
      toast.promise(
        async () => {
          const response = await authClient.signUp.email({
            name: value.name,
            email: value.email,
            password: value.password,
            callbackURL: `${SITE_URL}/dashboard`,
          })
          if (response.error) {
            throw new Error(response.error.message)
          }
          return response
        },
        {
          loading: "Registering...",
          success: () => {
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
      {/* Name Input */}
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
                placeholder="Enter your name"
                autoComplete="off"
                type="text"
              />
              {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )
        }}
      />
      {/* Email Input */}
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
                placeholder="Enter your email"
                autoComplete="off"
                type="email"
              />
              {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )
        }}
      />
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
        <Button type="submit">Register</Button>
      </Field>
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
