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

const metadata: CreateMetaInput = {
  title: `Login - ${SITE_TITLE}`,
  description: `Login to your ${SITE_TITLE} account to access your dashboard and manage your settings.`,
  url: `${SITE_URL}/login`,
  ogType: "website",
  twitterCard: "summary_large_image",
}

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
  head: () => createMeta(metadata),
});

const LoginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().nonempty("Please enter your password."),
})

function LoginPage() {
  const form = useForm({
    validators: {
      onSubmit: LoginSchema
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit({ value }) {
      toast.promise(
        async () => {
          const response = await authClient.signIn.email({
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
          loading: "Logging in...",
          success: () => {
            return "Login successful!"
          },
          error: e => {
            return e instanceof Error ? e.message : "An error occurred during login."
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
          Welcome back to {SITE_TITLE}
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email and password to access your account.
        </p>
      </div>
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
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                {/* @ts-ignore */}
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter your password"
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
        <Button type="submit">Login</Button>
      </Field>
      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <Button variant="outline" type="button">
          Login with Google
        </Button>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          {/* @ts-ignore */}
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>)
}
