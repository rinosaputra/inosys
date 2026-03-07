import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Home, User } from 'lucide-react'

export const Route = createFileRoute('/(protected)/(default)/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return <main className="page-wrap">
    <section className="island-shell rounded-2xl p-6 sm:p-8">
      <p className="island-kicker mb-2">Access denied</p>

      <h1 className="display-title m-0 text-3xl font-bold tracking-tight sm:text-4xl">
        You don&apos;t have permission to view this page
      </h1>

      <p className="mt-3 text-sm">
        If you think this is a mistake, contact an administrator.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          {/* @ts-ignore */}
          <Link to="/account/">
            <User />
            Go to account
          </Link>
        </Button>

        <Button asChild>
          {/* @ts-ignore */}
          <Link to="/">
            <Home />
            Go to home
          </Link>
        </Button>
      </div>
    </section>
  </main>
}
