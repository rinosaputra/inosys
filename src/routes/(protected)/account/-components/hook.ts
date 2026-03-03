import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { authClient } from '#/lib/auth-client'
import type {
  UpdateEmailInput,
  UpdatePasswordInput,
  UpdateProfileInput
} from './schema'

const queryKey = (...keys: string[]) => ['account', ...keys]

export const useAccountUpdateProfile = () => {
  const router = useRouter()
  const action = useMutation({
    mutationFn: async (body: UpdateProfileInput) => {
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
    updateProfile: (body: UpdateProfileInput) => toast.promise(action.mutateAsync(body), {
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
    mutationFn: async (body: UpdateEmailInput) => {
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
    updateEmail: (body: UpdateEmailInput) => toast.promise(action.mutateAsync(body), {
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
    mutationFn: async (body: UpdatePasswordInput) => {
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
    updatePassword: (body: UpdatePasswordInput) => toast.promise(action.mutateAsync(body), {
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
