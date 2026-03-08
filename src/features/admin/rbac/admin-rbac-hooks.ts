import { useMutation } from "@tanstack/react-query"

export const useAdminRBACCreate = () => {
  useMutation({
    mutationFn: async (data: any) => {
      // Implement the API call to create a new RBAC user
      // For example:
      // return await api.post('/admin/rbac/create', data)
      console.log('Creating RBAC user with data:', data)
    }
  })
}
