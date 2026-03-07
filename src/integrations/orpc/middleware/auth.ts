import { getRequestHeaders } from "@tanstack/react-start/server";
import { ORPCError } from "@orpc/server";
import { auth } from "#/lib/auth";

import { base } from "../base"

export const authMiddleware = base.middleware(async ({ next }) => {
  const headers = getRequestHeaders();
  const sessionData = await auth.api.getSession({
    headers
  })

  if (!sessionData?.session || !sessionData?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  // Adds session and user to the context
  return next({
    context: sessionData
  })
})
