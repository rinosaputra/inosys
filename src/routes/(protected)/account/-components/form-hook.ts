import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "#/integrations/tanstack-form/form-context";
import { TextField } from "#/components/form/fields/TextField";
import { PasswordField } from "#/components/form/fields/PasswordField";
import { SubmitForm } from "#/components/form/forms/SubmitForm";

export const {
  useAppForm: useAppFormAccount,
  withForm: withFormAccount,
} = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: {
    TextField,
    PasswordField,
  },

  formComponents: {
    SubmitForm
  }

})
