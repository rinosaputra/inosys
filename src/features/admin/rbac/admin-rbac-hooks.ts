import { useMutation } from "@tanstack/react-query"

import { authClient } from "#/lib/auth-client"
// import { getDataTableQueryKey } from "#/components/data/table/utils"
// import { getContext } from "#/integrations/tanstack-query/root-provider"
import type { Role } from "#/integrations/better-auth/rbac/permission"

// import { adminRBACQueryKey } from "./admin-rbac-const"
import type { AdminRBACCreate } from "./admin-rbac-schema"

// export const useAdminRBACRevalidate = () => {
//   const { queryClient } = getContext()

//   return () => queryClient.invalidateQueries({
//     queryKey: getDataTableQueryKey(adminRBACQueryKey),
//   })
// }

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
  mutationFn: async (data: { userId: string, name: string }) => {
    const response = await authClient.admin.updateUser({
      userId: data.userId,
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

export const useAdminRBACChangePassword = () => useMutation({
  mutationFn: async (data: { userId: string, password: string }) => {
    const response = await authClient.admin.setUserPassword({
      userId: data.userId,
      newPassword: data.password,
    })
    if (response.error) {
      throw new Error(response.error.message || 'Failed to change password user')
    }
    return response.data
  }
})

export const useAdminRBACChangeRole = () => useMutation({
  mutationFn: async (data: { userId: string, role: Role }) => {
    const response = await authClient.admin.setRole({
      userId: data.userId,
      role: data.role,
    })
    if (response.error) {
      throw new Error(response.error.message || 'Failed to change role user')
    }
    return response.data
  }
})
