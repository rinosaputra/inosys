import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-context'

import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'

import { SubmitForm } from './forms/SubmitForm'
import { ResetForm } from './forms/ResetForm'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,

    // Can add more custom field components here
  },
  formComponents: {
    SubmitForm,
    ResetForm,

    // Can add more custom form components here
  },
})
