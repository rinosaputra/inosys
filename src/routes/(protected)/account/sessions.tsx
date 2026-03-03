import { createFileRoute, Link } from '@tanstack/react-router'
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
import { useAccountSessionLists } from './-components/hook'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Ban, Computer, LogOut, Phone } from 'lucide-react'
import type { Auth } from '#/lib/auth'
import { UAParser } from 'ua-parser-js'
import { useMemo } from 'react'

const metadata: CreateMetaInput = {
  title: 'Session Management',
  description: 'View and manage your active sessions. You can choose to logout from all devices to ensure your account remains secure.',
}

export const Route = createFileRoute('/(protected)/account/sessions')({
  component: AccountSessionsPage,
})

function AccountSessionsPage() {
  const { auth: { session } } = Route.useRouteContext()
  const { data = [], isLoading } = useAccountSessionLists()

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
        {isLoading ? (
          <p>Loading sessions...</p>
        ) : data.length === 0 ? (
          <SessionIsEmpty />
        ) : (
          <div className="flex w-full max-w-lg flex-col gap-6">
            {data?.map(e => ({
              ...e,
              isCurrent: session.id === e.id,
            })).map((session) => (
              <SessionItem key={session.id} {...session} />
            ))}
          </div>
        )}
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

function SessionIsEmpty() {
  return (<Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Ban />
      </EmptyMedia>
      <EmptyTitle>No Active Sessions</EmptyTitle>
      <EmptyDescription>
        You have no active sessions. All your devices are currently logged out.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent className="flex-row justify-center gap-2">
      <Button asChild>
        <Link to="/account" className="w-full">
          Explore account settings
        </Link>
      </Button>
    </EmptyContent>
  </Empty>)
}

function SessionItem({
  userAgent,
  isCurrent
}: Auth['Session']['session'] & {
  isCurrent: boolean
}) {
  const {
    icon: Icon,
    ...props
  } = useMemo(() => {
    if (!userAgent) return {
      icon: Ban,
      device: 'Unknown Device',
      browser: 'Unknown Browser',
      os: 'Unknown OS',
    }
    const parser = new UAParser(userAgent)
    const result = parser.getResult()
    return {
      icon: result.device.type === 'mobile' ? Phone : Computer,
      device: `${result.os.name} ${result.os.version}`,
      browser: `${result.browser.name} - ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
    }
  }, [userAgent])
  return (<Item variant="outline">
    <ItemMedia variant="icon">
      <Icon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>{props.device}</ItemTitle>
      <ItemDescription>
        {props.browser} on {props.os} {isCurrent && '(Current Session)'}
      </ItemDescription>
    </ItemContent>
    {!isCurrent && <ItemActions>
      <Button size="icon" variant="outline">
        <LogOut />
      </Button>
    </ItemActions>}
  </Item>)
}
