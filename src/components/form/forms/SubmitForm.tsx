import type { LucideIcon } from "lucide-react"

import { useFormContext } from '#/integrations/tanstack-form/form-context'

import { Button } from "#/components/ui/button"
import { Spinner } from "#/components/ui/spinner"

type SubmitFormProps = {
  label?: string
  icon?: LucideIcon
  isLoading?: boolean
  loadingLabel?: string
} & Pick<React.ComponentProps<typeof Button>, "variant" | "size">

export function SubmitForm({
  label = "Submit",
  icon,
  isLoading,
  loadingLabel,
  ...props
}: SubmitFormProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => {
        const isPending = isSubmitting || isLoading
        const Icon = isPending ? Spinner : icon
        return (
          <Button {...{
            ...props,
            type: "submit",
            disabled: isSubmitting || isLoading
          }}>
            {Icon && <Icon />}
            {isPending && loadingLabel ? loadingLabel ?? label : label}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
