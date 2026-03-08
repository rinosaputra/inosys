import { auth } from '#/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { AdminRBACSchema } from './admin-rbac-schema';

export const adminRBACGetUserById = createServerFn({ method: "GET" })
  .inputValidator(AdminRBACSchema.pick({ id: true }))
  .handler(async ({ data: { id } }) => {
    const headers = getRequestHeaders();
    const data = await auth.api.getUser({
      headers,
      query: {
        id
      },
    });

    if (!data) {
      throw new Error("Not Found");
    }

    return data;
  });
