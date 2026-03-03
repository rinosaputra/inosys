import { createFileRoute } from '@tanstack/react-router'
import { Link } from 'lucide-react'

export const Route = createFileRoute('/(protected)/account/')({
  component: AccountLandingPage,
})

function AccountLandingPage() {
  return (
    <div>
      <h2 className="m-0 text-xl font-semibold">
        Overview
      </h2>
      <p className="mt-2 text-sm">
        Quick links to manage your account.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to="/account/profile"
          className="island-shell block rounded-2xl p-5 no-underline"
        >
          <h3 className="m-0 text-base font-semibold">
            Profile
          </h3>
          <p className="m-0 mt-1 text-sm">
            Update name and avatar URL.
          </p>
        </Link>

        <Link
          to="/account/email"
          className="island-shell block rounded-2xl p-5 no-underline"
        >
          <h3 className="m-0 text-base font-semibold">
            Email
          </h3>
          <p className="m-0 mt-1 text-sm">
            Change your email address.
          </p>
        </Link>

        <Link
          to="/account/password"
          className="island-shell block rounded-2xl p-5 no-underline"
        >
          <h3 className="m-0 text-base font-semibold">
            Password
          </h3>
          <p className="m-0 mt-1 text-sm">
            Update your password.
          </p>
        </Link>

        <Link
          to="/account/sessions"
          className="island-shell block rounded-2xl p-5 no-underline"
        >
          <h3 className="m-0 text-base font-semibold">
            Sessions
          </h3>
          <p className="m-0 mt-1 text-sm">
            Logout all devices.
          </p>
        </Link>
      </div>
    </div>
  )
}
