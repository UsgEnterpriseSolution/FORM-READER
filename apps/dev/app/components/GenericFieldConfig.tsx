import React from "react";

import GenericTextField from "./GenericTextField";
import GenericOptionField from "./GenericOptionField";
import GenericColumnField from "./GenericColumnField";
import GenericToggleField from "./GenericToggleField";

import {
  columnFieldSchema,
  optionFieldSchema,
  textFieldSchema,
  toggleFieldSchema,
} from "~/zod";
import { useConfigField } from "~/zustand";

type GenericFieldConfigProps = {
  fieldId: string;
};

function Component({ fieldId }: GenericFieldConfigProps) {
  const field = useConfigField(fieldId);

  const textFieldZodObj = textFieldSchema.safeParse(field?.data);
  const optionFieldZodObj = optionFieldSchema.safeParse(field?.data);
  const columnFieldZodObj = columnFieldSchema.safeParse(field?.data);
  const toggleFieldZodObj = toggleFieldSchema.safeParse(field?.data);

  if (textFieldZodObj.success) {
    return <GenericTextField fieldId={fieldId} data={textFieldZodObj.data} />;
  }

  if (optionFieldZodObj.success) {
    return (
      <GenericOptionField fieldId={fieldId} data={optionFieldZodObj.data} />
    );
  }

  if (columnFieldZodObj.success) {
    return (
      <GenericColumnField fieldId={fieldId} data={columnFieldZodObj.data} />
    );
  }

  if (toggleFieldZodObj.success) {
    return (
      <GenericToggleField fieldId={fieldId} data={toggleFieldZodObj.data} />
    );
  }

  return <p>Unknown field type</p>;
}

export const GenericFieldConfig = React.memo(Component);
