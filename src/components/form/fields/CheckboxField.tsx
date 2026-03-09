import { useFieldContext } from '#/integrations/tanstack-form/form-context'

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

type CheckboxFieldProps = {
  label: string
  description?: React.ReactNode
  placeholder?: string
} & Omit<
  React.ComponentProps<typeof Checkbox>,
  'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

export function CheckboxField({
  label,
  description,
  className,
  placeholder,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <div className={cn(className)}>
      <FieldSet>
        <FieldLegend variant="label">{label}</FieldLegend>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        <FieldGroup data-slot="checkbox-group">
          <Field
            orientation="horizontal"
            data-invalid={isInvalid}
          >
            <Checkbox
              {...props}
              id={field.name}
              name={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) =>
                field.handleChange(checked === true)
              }
            />
            <FieldLabel htmlFor={field.name} className="font-normal">{placeholder}</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </div>
  )
}
