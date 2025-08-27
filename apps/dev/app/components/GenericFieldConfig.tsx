import React from "react";

import GenericTextField from "./GenericTextField";
import GenericOptionField from "./GenericOptionField";
import GenericColumnField from "./GenericColumnField";
import GenericToggleField from "./GenericToggleField";

import type { ConfigFieldType } from "~/types";
import {
  columnFieldTypeSchema,
  optionFieldTypeSchema,
  textFieldTypeSchema,
  toggleFieldTypeSchema,
} from "~/zod";

type GenericFieldConfigProps = {
  id: string;
  type: ConfigFieldType;
  handleDelete: (id: string) => void;
};

function Component(props: GenericFieldConfigProps) {
  const textFieldZodObj = textFieldTypeSchema.safeParse(props.type);
  const optionFieldZodObj = optionFieldTypeSchema.safeParse(props.type);
  const columnFieldZodObj = columnFieldTypeSchema.safeParse(props.type);
  const toggleFieldZodObj = toggleFieldTypeSchema.safeParse(props.type);

  if (textFieldZodObj.success) {
    return <GenericTextField {...props} type={textFieldZodObj.data} />;
  }

  if (optionFieldZodObj.success) {
    return <GenericOptionField {...props} type={optionFieldZodObj.data} />;
  }

  if (columnFieldZodObj.success) {
    return <GenericColumnField {...props} type={columnFieldZodObj.data} />;
  }

  if (toggleFieldZodObj.success) {
    return <GenericToggleField {...props} type={toggleFieldZodObj.data} />;
  }

  return <p>Unknown field type</p>;
}

export const GenericFieldConfig = React.memo(Component);
