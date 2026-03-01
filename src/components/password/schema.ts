import { z } from "zod"

/**
 * Password Validation Utilities
 *
 * Extends existing validation setup from feature/form-validation.
 * Provides both Zod schemas and runtime strength calculation.
 *
 * Architecture:
 * - Reuses existing Zod patterns
 * - Consistent with auth.ts, user.ts
 * - Separates schema validation from UI feedback
 *
 * @module components/password/schema
 */

// ============================================================================
// Zod Schemas (for form validation)
// ============================================================================

/**
 * Password schema with comprehensive requirements
 *
 * Used in forms with react-hook-form + Zod resolver
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  )

/**
 * Password confirmation schema
 *
 * Ensures password and confirmation match
 */
export const passwordConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type PasswordConfirmation = z.infer<typeof passwordConfirmationSchema>

// ============================================================================
// Runtime Validation (for UI feedback)
// ============================================================================

export type PasswordStrength = 0 | 1 | 2 | 3 | 4

export interface PasswordStrengthResult {
  score: PasswordStrength
  feedback: string[]
  isStrong: boolean
  color: "red" | "orange" | "yellow" | "lime" | "green"
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong"
}

/**
 * Calculate password strength (runtime, not Zod)
 *
 * Used by PasswordStrength component for real-time feedback.
 * Separate from Zod validation to avoid circular dependencies.
 */
export function calculatePasswordStrength(
  password: string
): PasswordStrengthResult {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) {
    score++
  } else if (password.length > 0) {
    feedback.push("Use at least 8 characters")
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++
  } else if (password.length > 0) {
    feedback.push("Add uppercase letter")
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++
  } else if (password.length > 0) {
    feedback.push("Add lowercase letter")
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score++
  } else if (password.length > 0) {
    feedback.push("Add number")
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score++
  } else if (password.length > 0) {
    feedback.push("Add special character")
  }

  const strengthScore = Math.min(score, 4) as PasswordStrength

  // Determine color and label
  const strengthConfig = {
    0: { color: "red" as const, label: "Very Weak" as const },
    1: { color: "orange" as const, label: "Weak" as const },
    2: { color: "yellow" as const, label: "Fair" as const },
    3: { color: "lime" as const, label: "Good" as const },
    4: { color: "green" as const, label: "Strong" as const },
  }

  const config = strengthConfig[strengthScore]

  return {
    score: strengthScore,
    feedback,
    isStrong: strengthScore >= 3,
    color: config.color,
    label: config.label,
  }
}

/**
 * Check if password meets minimum requirements
 *
 * Quick validation without full Zod parse
 */
export function meetsMinimumRequirements(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
}
