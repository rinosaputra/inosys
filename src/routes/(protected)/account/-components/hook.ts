import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { authClient } from '#/lib/auth-client'
import type {
  UpdateEmailValues,
  UpdatePasswordValues,
  UpdateProfileValues
} from './schema'
// import { getContext } from '#/integrations/tanstack-query/root-provider'

const queryKey = (...keys: string[]) => ['account', ...keys]

export const useAccountUpdateProfile = () => {
  const router = useRouter()
  const action = useMutation({
    mutationFn: async (body: UpdateProfileValues) => {
      const response = await authClient.updateUser({
        name: body.name,
        image: body.avatarUrl,
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    }
  })
  return {
    isLoading: action.isPending,
    updateProfile: (body: UpdateProfileValues) => toast.promise(action.mutateAsync(body), {
      loading: 'Updating profile...',
      success: () => {
        router.invalidate()
        return 'Profile updated successfully'
      },
      error: (err) => err.message || 'Failed to update profile',
    }),
  }
}

export const useAccountUpdateEmail = () => {
  const router = useRouter()
  const action = useMutation({
    mutationFn: async (body: UpdateEmailValues) => {
      const response = await authClient.changeEmail({
        newEmail: body.email,
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    }
  })
  return {
    isLoading: action.isPending,
    updateEmail: (body: UpdateEmailValues) => toast.promise(action.mutateAsync(body), {
      loading: 'Updating email...',
      success: () => {
        router.invalidate()
        return 'Email updated successfully'
      },
      error: (err) => err.message || 'Failed to update email',
    }),
  }
}

export const useAccountUpdatePassword = () => {
  const router = useRouter()
  const action = useMutation({
    mutationFn: async (body: UpdatePasswordValues) => {
      const response = await authClient.changePassword({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    }
  })
  return {
    isLoading: action.isPending,
    updatePassword: (body: UpdatePasswordValues) => toast.promise(action.mutateAsync(body), {
      loading: 'Updating password...',
      success: () => {
        router.invalidate()
        return 'Password updated successfully'
      },
      error: (err) => err.message || 'Failed to update password',
    }),
  }
}

export const useAccountSessionLists = () => {
  return useQuery({
    queryKey: queryKey('sessions'),
    queryFn: async () => {
      const response = await authClient.listSessions()
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    },
  })
}

export const useAccountRevokeSession = () => {
  // const { queryClient } = getContext()
  const action = useMutation({
    mutationFn: async (token: string) => {
      const response = await authClient.revokeSession({
        token
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    }
  })
  return {
    isLoading: action.isPending,
    revokeSession: (token: string) => toast.promise(action.mutateAsync(token), {
      loading: 'Revoking session...',
      success: () => {
        // queryClient.invalidateQueries({
        //   queryKey: queryKey(),
        // })
        return 'Session revoked successfully'
      },
      error: (err) => err.message || 'Failed to revoke session',
    }),
  }
}

export const useAccountRevokeAllSession = () => {
  // const { queryClient } = getContext()
  const action = useMutation({
    mutationFn: async () => {
      const response = await authClient.revokeOtherSessions({})
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    }
  })
  return {
    isLoading: action.isPending,
    revokeAllSessions: () => toast.promise(action.mutateAsync(), {
      loading: 'Revoking all sessions...',
      success: () => {
        // queryClient.invalidateQueries({
        //   queryKey: queryKey(),
        // })
        return 'Session revoked successfully'
      },
      error: (err) => err.message || 'Failed to revoke session',
    }),
  }
}
