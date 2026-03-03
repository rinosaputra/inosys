import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/account')({
  component: AccountLayout,
})

function AccountLayout() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <p className="island-kicker mb-2">Account</p>
          <h1 className="display-title m-0 text-3xl font-bold tracking-tight sm:text-4xl">
            Account settings
          </h1>
          <p className="m-0 mt-2 text-sm">
            Manage your profile, email, password, and sessions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="island-shell rounded-2xl p-4">
            <nav className="flex flex-col gap-1">
              <AccountNavLink to="/account/" label="Overview" />
              <AccountNavLink to="/account/profile" label="Profile" />
              <AccountNavLink to="/account/email" label="Email" />
              <AccountNavLink to="/account/password" label="Password" />
              <AccountNavLink to="/account/sessions" label="Sessions" />
            </nav>
          </aside>

          <section className="island-shell rounded-2xl p-5 sm:p-6">
            <Outlet />
          </section>
        </div>
      </section>
    </main>
  )
}

function AccountNavLink(props: { to: string; label: string }) {
  return (
    <Link
      to={props.to}
      className="rounded-xl px-3 py-2 text-sm font-semibold no-underline transition"
      activeProps={{
        className:
          'rounded-xl px-3 py-2 text-sm font-semibold no-underline bg-[var(--link-bg-hover)] text-[var(--sea-ink)]',
      }}
    >
      {props.label}
    </Link>
  )
}
