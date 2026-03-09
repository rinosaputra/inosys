import { useFieldContext } from '#/integrations/tanstack-form/form-context'

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '#/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'
import type { LucideIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

interface Option<T> {
  value: T
  label: string
  icon?: LucideIcon
}

type SelectFieldProps<T> = {
  label: string
  description?: React.ReactNode
  placeholder?: string,
  className?: string,
  options: Option<T>[]
  empty?: Option<string>
} & Omit<
  React.ComponentProps<typeof Select>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function SelectField<T extends string = string>({
  label,
  description,
  className,
  placeholder,
  options,
  empty,
  ...props
}: SelectFieldProps<T>) {
  const field = useFieldContext<T>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid} orientation="responsive">
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        <FieldError
          errors={field.state.meta.errors?.map((e) => ({
            message: typeof e === 'string' ? e : (e as any)?.message,
          }))}
        />
      </FieldContent>
      <Select
        {...props}
        name={field.name}
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v as T)}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className={cn("min-w-30", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {empty && <>
            <SelectItem value={empty.value}>{empty.label}</SelectItem>
            <SelectSeparator />
          </>}
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.icon && <option.icon />}
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
