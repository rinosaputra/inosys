import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createMeta, type CreateMetaInput } from "#/lib/seo";
import { SITE_TITLE, SITE_URL } from "#/lib/site";

const metadata: CreateMetaInput = {
  title: `Login - ${SITE_TITLE}`,
  description: "Login to your MyApp account to access your dashboard and manage your settings.",
  url: `${SITE_URL}/login`,
  ogType: "website",
  twitterCard: "summary_large_image",
}

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
  head: () => createMeta(metadata),
});

function LoginPage() {
  return (<form className="flex flex-col gap-6">
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </Field>
      <Field>
        <div className="flex items-center">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          {/* @ts-ignore */}
          <Link
            href="/forgot-password"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Input id="password" type="password" required />
      </Field>
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
