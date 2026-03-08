import { useFieldContext } from '../form-context'

import { cn } from '#/lib/utils'
import { Switch } from '#/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'

type SwitchFieldProps = {
  label: string
  description?: React.ReactNode
} & Omit<
  React.ComponentProps<typeof Switch>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function SwitchField({
  label,
  description,
  className,
  ...props
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field
      orientation="horizontal"
      data-invalid={isInvalid}
      className={cn(className)}
    >
      <FieldContent>
        <FieldLabel htmlFor={field.name} className="font-normal">{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </FieldContent>
      <Switch
        {...props}
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        aria-invalid={isInvalid}
      />
    </Field>
  )
}
