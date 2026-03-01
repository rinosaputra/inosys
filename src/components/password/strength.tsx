import { cn } from "#/lib/utils"
import { calculatePasswordStrength } from "./schema"

interface PasswordStrengthProps {
  password: string
  showFeedback?: boolean
  className?: string
}

/**
 * Password Strength Indicator Component
 *
 * Visual indicator of password strength with optional feedback.
 *
 * Features:
 * - 5-level strength bar (0-4)
 * - Color-coded feedback (red → green)
 * - Strength label
 * - Improvement suggestions
 *
 * Architecture:
 * - Uses calculatePasswordStrength utility
 * - Accessible (ARIA live region)
 * - Customizable via props
 *
 * @example
 * ```tsx
 * <PasswordStrength password={password} showFeedback />
 * ```
 */
export function PasswordStrength({
  password,
  showFeedback = true,
  className,
}: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password)

  // Don't show indicator if password is empty
  if (!password) {
    return null
  }

  const strengthColors = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    lime: "bg-lime-500",
    green: "bg-green-500",
  }

  return (
    <div className={cn("space-y-2", className)} aria-live="polite">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength.score
                ? strengthColors[strength.color]
                : "bg-muted"
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between text-xs">
        <span
          className={cn(
            "font-medium",
            strength.score === 0 && "text-red-600 dark:text-red-400",
            strength.score === 1 && "text-orange-600 dark:text-orange-400",
            strength.score === 2 && "text-yellow-600 dark:text-yellow-400",
            strength.score === 3 && "text-lime-600 dark:text-lime-400",
            strength.score === 4 && "text-green-600 dark:text-green-400"
          )}
        >
          {strength.label}
        </span>
        <span className="text-muted-foreground">
          {strength.score}/4
        </span>
      </div>

      {/* Feedback Messages */}
      {showFeedback && strength.feedback.length > 0 && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {strength.feedback.map((message, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>{message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
