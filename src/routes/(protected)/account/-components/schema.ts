import { passwordSchema } from "#/components/password/schema";
import z from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  avatarUrl: z
    .url('Avatar must be a valid URL.')
    .or(z.literal('')),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export const UpdateEmailSchema = z.object({
  email: z.email('Please enter a valid email address.'),
})

export type UpdateEmailInput = z.infer<typeof UpdateEmailSchema>

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  })

export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>
