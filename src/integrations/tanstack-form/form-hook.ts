import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-context'

import { TextField } from '#/components/form/fields/TextField'
import { TextareaField } from '#/components/form/fields/TextareaField'
import { SelectField } from '#/components/form/fields/SelectField'
import { CheckboxField } from '#/components/form/fields/CheckboxField'
import { MultipleCheckboxField } from '#/components/form/fields/MultipleCheckboxField'
import { RadioGroupField } from '#/components/form/fields/RadioGroupField'
import { SwitchField } from '#/components/form/fields/SwitchField'

import { SubmitForm } from '#/components/form/forms/SubmitForm'
import { ResetForm } from '#/components/form/forms/ResetForm'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
    MultipleCheckboxField,
    RadioGroupField,
    SwitchField,

    // Can add more custom field components here
  },
  formComponents: {
    SubmitForm,
    ResetForm,

    // Can add more custom form components here
  },
})
