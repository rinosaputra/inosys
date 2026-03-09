import { useFieldContext } from '#/integrations/tanstack-form/form-context'

import { Input } from '#/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'

type TextFieldProps = {
  label: string
  description?: React.ReactNode
  placeholder?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
} & Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function TextField({
  label,
  description,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <FieldContent>
        <Input
          {...props}
          name={field.name}
          value={field.state.value ?? ''}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid || undefined}
        />

        {description ? <FieldDescription>{description}</FieldDescription> : null}

        {/* TanStack Form error shape can vary (string, object, etc).
            Our FieldError accepts an array of { message?: string }, so we normalize. */}
        <FieldError
          errors={field.state.meta.errors?.map((e) => ({
            message: typeof e === 'string' ? e : (e as any)?.message,
          }))}
        />
      </FieldContent>
    </Field>
  )
}
