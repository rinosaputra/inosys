import { getSession } from "#/integrations/better-auth/server";
import { AUTH_IS_AUTH_URL, SITE_TITLE } from "#/lib/site";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: AUTH_IS_AUTH_URL });
    }
    return { auth: null };
  },
  component: AuthLayout,
});

export function AuthLayout() {
  return (<div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        {/* @ts-ignore */}
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <img
              src="/logo512.png"
              alt="Logo"
              className="size-4"
            />
          </div>
          {SITE_TITLE}
        </Link  >
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <Outlet />
        </div>
      </div>
    </div>
    <div className="bg-muted relative hidden lg:block">
      <img
        src="/images/auth/placeholder.svg"
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>)
}
