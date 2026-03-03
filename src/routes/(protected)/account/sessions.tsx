import { createFileRoute, Link } from '@tanstack/react-router'
import { Ban, Computer, LogOut, Phone } from 'lucide-react'
import { UAParser } from 'ua-parser-js'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns';
import type { CreateMetaInput } from '#/lib/seo'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldGroup,
} from '#/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { useAccountRevokeAllSession, useAccountRevokeSession, useAccountSessionLists } from './-components/hook'

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
import type { Auth } from '#/lib/auth'
import { Badge } from '#/components/ui/badge'
import { locale } from '#/lib/date';
import { Spinner } from '#/components/ui/spinner';

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
  const { revokeSession, isLoading: isRevoking } = useAccountRevokeSession()

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
        <div className="flex w-full max-w-lg flex-col gap-6">
          {isLoading ? (
            <p>Loading sessions...</p>
          ) : data.length === 0 ? (
            <SessionIsEmpty />
          ) : data.map(e => ({
            ...e,
            isCurrent: session.id === e.id,
          })).map((session) => (
            <SessionItem key={session.id} {...session} isLoading={isRevoking} onSubmit={revokeSession} />
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <LogoutAllSessions />
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
  updatedAt,
  isCurrent,
  isLoading,
  onSubmit,
  token
}: Auth['Session']['session'] & {
  isCurrent: boolean
  isLoading: boolean
  onSubmit: (token: string) => void
}) {
  const {
    icon: Icon,
    ...props
  } = useMemo(() => {
    if (!userAgent) return {
      icon: Ban,
      device: 'Unknown Device',
      browser: 'Unknown Browser',
    }
    const parser = new UAParser(userAgent)
    const result = parser.getResult()
    return {
      icon: result.device.type === 'mobile' ? Phone : Computer,
      device: `${result.os.name} ${result.os.version}`,
      browser: `${result.browser.name} - ${result.browser.version}`,
    }
  }, [userAgent])
  const lastActive = useMemo(() => {
    const date = new Date(updatedAt)
    return formatDistanceToNow(date, { addSuffix: true, locale })
  }, [updatedAt])

  return (<Item variant="outline">
    <ItemMedia variant="icon">
      <Icon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>
        {props.device}
        {isCurrent && <Badge className="ml-auto text-xs font-mono">Current Session</Badge>}
      </ItemTitle>
      <ItemDescription>
        {props.browser}
        <br />
        Last active: {lastActive}
      </ItemDescription>
    </ItemContent>
    {!isCurrent && <ItemActions>
      <Button
        size="icon"
        variant="outline"
        onClick={() => onSubmit(token)}
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : <LogOut />}
      </Button>
    </ItemActions>}
  </Item>)
}

function LogoutAllSessions() {
  const { isLoading, revokeAllSessions } = useAccountRevokeAllSession()
  return (<FieldGroup>
    <Field>
      <Button
        variant="destructive"
        type="button"
        onClick={() => {
          console.log('logout all devices')
          revokeAllSessions()
        }}
        disabled={isLoading}
      >
        {isLoading && <Spinner />}
        {isLoading ? 'Revoking sessions...' : 'Logout from all other devices'}
      </Button>
    </Field>
  </FieldGroup>)
}
