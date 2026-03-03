import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ACCOUNT_URLs } from './-urls';
import type { CreateMetaInput } from '#/lib/seo';

const metadata: CreateMetaInput = {
  title: 'Account Settings',
  description: 'Manage your account settings including profile, email, password, and sessions.',
}

export const Route = createFileRoute('/(protected)/account')({
  component: AccountLayout,
})

function AccountLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <p className="island-kicker mb-2">Account</p>
              <h1 className="display-title m-0 text-3xl font-bold tracking-tight sm:text-4xl">
                {metadata.title}
              </h1>
              <p className="m-0 mt-2 text-sm">
                {metadata.description}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              <aside className="island-shell rounded-2xl p-4">
                <nav className="flex flex-col gap-1">
                  {ACCOUNT_URLs.map((account, index) => (<Link
                    key={index}
                    to={account.url}
                    className="rounded-xl px-3 py-2 text-sm font-semibold no-underline transition"
                    activeProps={{
                      className:
                        'rounded-xl px-3 py-2 text-sm font-semibold no-underline',
                    }}
                  >
                    {account.label}
                  </Link>))}
                </nav>
              </aside>

              <section className="island-shell rounded-2xl p-5 sm:p-6">
                <Outlet />
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
