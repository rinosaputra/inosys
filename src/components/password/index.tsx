import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "#/components/ui/input-group"
import { PasswordStrength } from "./strength"

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  showStrength?: boolean
  showStrengthFeedback?: boolean
  error?: boolean
}

/**
 * Password Input Component
 *
 * Enhanced password input with show/hide toggle and strength indicator.
 *
 * Features:
 * - Show/hide password toggle
 * - Password strength indicator (optional)
 * - Strength feedback messages (optional)
 * - Error state support
 * - Accessible (ARIA labels)
 *
 * Architecture:
 * - Composable with InputGroup primitive
 * - Controlled visibility state
 * - Reusable across auth, settings, admin
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 *
 * // With strength indicator
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   showStrength
 *   showStrengthFeedback
 * />
 *
 * // With error state
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   error={!!errors.password}
 * />
 * ```
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showStrength = false,
      showStrengthFeedback = true,
      error = false,
      value = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className="space-y-2">
        <InputGroup >
          <InputGroupInput
            type={showPassword ? "text" : "password"}
            className={className}
            ref={ref}
            value={value}
            {...props}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1} // Prevent tab focus (use main input)
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {/* Password Strength Indicator */}
        {showStrength && (
          <PasswordStrength
            password={String(value)}
            showFeedback={showStrengthFeedback}
          />
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
