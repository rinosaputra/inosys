import { useFieldContext } from '#/integrations/tanstack-form/form-context'
import type { LucideIcon } from 'lucide-react'

import { cn } from '#/lib/utils'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '#/components/ui/field'

interface Option<T> {
  value: T
  label: string
  icon?: LucideIcon
}

type MultipleCheckboxFieldProps<T> = {
  label: string
  description?: React.ReactNode
  options: Option<T>[]
} & Omit<
  React.ComponentProps<typeof Checkbox>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function MultipleCheckboxField<T extends string = string>({
  label,
  description,
  className,
  options
}: MultipleCheckboxFieldProps<T>) {
  const field = useFieldContext<T[]>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldGroup className={cn(className)}>
      <FieldSet>
        <FieldLegend variant="label">{label}</FieldLegend>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        <FieldGroup data-slot="checkbox-group">
          {options.map((option) => (
            <Field
              key={option.value}
              orientation="horizontal"
              data-invalid={isInvalid}
            >
              <Checkbox
                id={`${field.name}-cb-${option.value}`}
                name={field.name}
                aria-invalid={isInvalid}
                checked={field.state.value.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.pushValue(option.value)
                  } else {
                    const index = field.state.value.indexOf(
                      option.value
                    )
                    if (index > -1) {
                      field.removeValue(index)
                    }
                  }
                }}
              />
              <FieldLabel
                htmlFor={`${field.name}-cb-${option.value}`}
                className="font-normal"
              >
                {option.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </FieldGroup>
  )
}
