import { getDataTableQueryKey } from "#/components/data/table/utils"
import { getContext } from "#/integrations/tanstack-query/root-provider"
import { useMutation } from "@tanstack/react-query"
import { adminRBACQueryKey } from "./admin-rbac-const"
import type { AdminRBACCreate, AdminRBACUpdate } from "./admin-rbac-schema"
import { authClient } from "#/lib/auth-client"

export const useAdminRBACRevalidate = () => {
  const { queryClient } = getContext()

  return () => queryClient.invalidateQueries({
    queryKey: getDataTableQueryKey(adminRBACQueryKey),
  })
}

export const useAdminRBACCreate = () => useMutation({
  mutationFn: async (data: AdminRBACCreate) => {
    const response = await authClient.admin.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    if (response.error) {
      throw new Error(response.error.message || 'Failed to create user')
    }
    return response.data
  }
})

export const useAdminRBACUpdate = () => useMutation({
  mutationFn: async (data: AdminRBACUpdate) => {
    const response = await authClient.admin.updateUser({
      userId: data.id,
      data: {
        name: data.name,
      }
    })
    if (response.error) {
      throw new Error(response.error.message || 'Failed to update user')
    }
    return response.data
  }
})
