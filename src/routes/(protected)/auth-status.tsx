import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/auth-status")({
  component: AuthStatus,
});

function AuthStatus() {
  const { auth } = Route.useRouteContext();
  return <div>
    <h1>Auth Status</h1>
    <p>You are authenticated!</p>
    <pre>{JSON.stringify(auth, null, 2)}</pre>
  </div>
}
