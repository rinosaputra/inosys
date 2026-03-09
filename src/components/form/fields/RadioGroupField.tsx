import { useFieldContext } from '../form-context'
import type { LucideIcon } from 'lucide-react'

import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '#/components/ui/field'

interface Option<T> {
  value: T
  label: string
  description?: string
  icon?: LucideIcon
}

type RadioGroupFieldProps<T> = {
  label: string
  description?: React.ReactNode
  options: Option<T>[]
} & Omit<
  React.ComponentProps<typeof RadioGroup>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function RadioGroupField<T extends string = string>({
  label,
  description,
  options
}: RadioGroupFieldProps<T>) {
  const field = useFieldContext<T>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet>
      <FieldLegend variant="label">{label}</FieldLegend>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <RadioGroup
        name={field.name}
        aria-invalid={isInvalid}
        value={field.state.value as unknown as string}
        onValueChange={v => field.handleChange(v as T)}
      >
        {options.map((option) => (
          <FieldLabel
            key={option.value}
            htmlFor={`${field.name}-rg-${option.value}`}
          >
            <Field
              orientation="horizontal"
              data-invalid={isInvalid}
            >
              <FieldContent>
                <FieldTitle>{option.label}</FieldTitle>
                <FieldDescription>
                  {option.description}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={option.value}
                id={`form-tanstack-radiogroup-${option.value}`}
                aria-invalid={isInvalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </FieldSet>
  )
}
