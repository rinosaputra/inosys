import { createFileRoute, Link } from '@tanstack/react-router'

import { createMeta, type CreateMetaInput } from '#/lib/seo';

import { ACCOUNT_URLs } from './-components/urls';

const metadata: CreateMetaInput = {
  title: 'Overview - Account Settings',
  description: 'Get a quick overview of your account settings and access links to manage your profile, email, password, and sessions.',
}

export const Route = createFileRoute('/(protected)/account/')({
  component: AccountLandingPage,
  head: () => createMeta(metadata),
})

function AccountLandingPage() {
  return (
    <div>
      <h2 className="m-0 text-xl font-semibold">
        {metadata.title}
      </h2>
      <p className="mt-2 text-sm">
        {metadata.description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {ACCOUNT_URLs.map((account, index) => (<Link
          key={index}
          to={account.url}
          className="island-shell block rounded-2xl p-5 no-underline"
        >
          <h3 className="m-0 text-base font-semibold">
            {account.label}
          </h3>
          <p className="m-0 mt-1 text-sm">
            {account.description}
          </p>
        </Link>))}
      </div>
    </div>
  )
}
