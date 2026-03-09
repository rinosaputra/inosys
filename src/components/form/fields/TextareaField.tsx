import { useFieldContext } from '#/integrations/tanstack-form/form-context'

import { Textarea } from '#/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/components/ui/field'

type TextareaFieldProps = {
  label: string
  description?: React.ReactNode
  placeholder?: string
} & Omit<
  React.ComponentProps<typeof Textarea>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function TextareaField({
  label,
  description,
  ...props
}: TextareaFieldProps) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <FieldContent>
        <Textarea
          {...props}
          name={field.name}
          value={field.state.value ?? ''}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid || undefined}
        />

        {description ? <FieldDescription>{description}</FieldDescription> : null}

        <FieldError
          errors={field.state.meta.errors?.map((e) => ({
            message: typeof e === 'string' ? e : (e as any)?.message,
          }))}
        />
      </FieldContent>
    </Field>
  )
}
