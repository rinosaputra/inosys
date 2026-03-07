import type { LucideIcon } from "lucide-react"

import { useFormContext } from "../form-context"

import { Button } from "#/components/ui/button"
import { Spinner } from "#/components/ui/spinner"

type ResetFormProps = {
  label?: string
  icon?: LucideIcon
  isLoading?: boolean
} & Pick<React.ComponentProps<typeof Button>, "variant" | "size" | "onClick">

export function ResetForm({
  label = "Reset",
  icon,
  isLoading,
  onClick,
  ...props
}: ResetFormProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => {
        const isPending = isSubmitting || isLoading
        const Icon = isPending ? Spinner : icon
        return (
          <Button {...{
            ...props,
            type: "button",
            disabled: isSubmitting || isLoading,
            onClick: (e) => {
              form.reset()
              if (onClick) onClick(e)
            }
          }}>
            {Icon && <Icon />}
            {label}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
