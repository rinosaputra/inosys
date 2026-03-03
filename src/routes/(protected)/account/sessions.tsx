import { createFileRoute } from '@tanstack/react-router'
import type { CreateMetaInput } from '#/lib/seo'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

const metadata: CreateMetaInput = {
  title: 'Session Management',
  description: 'View and manage your active sessions. You can choose to logout from all devices to ensure your account remains secure.',
}

export const Route = createFileRoute('/(protected)/account/sessions')({
  component: AccountSessionsPage,
})

function AccountSessionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{metadata.title}</CardTitle>
        <CardDescription>
          {metadata.description}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
      </CardContent>
      <Separator />
      <CardFooter>
        <FieldGroup className="mt-5">
          <Field>
            <FieldDescription>
              This will revoke all active sessions and require you to sign in
              again on other devices.
            </FieldDescription>
          </Field>

          <FieldSeparator />

          <Field>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                // TODO(feat): serverFn revoke all sessions + toast
                console.log('logout all devices')
              }}
            >
              Logout all devices
            </Button>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}
