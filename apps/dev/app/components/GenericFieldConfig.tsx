import React from "react";

import GenericTextField from "./GenericTextField";
import GenericOptionField from "./GenericOptionField";
import GenericColumnField from "./GenericColumnField";
import GenericToggleField from "./GenericToggleField";

import type { ConfigFieldType } from "~/types";
import {
  columnFieldSchema,
  optionFieldSchema,
  textFieldSchema,
  toggleFieldSchema,
} from "~/zod";

type GenericFieldConfigProps = {
  id: string;
  type: ConfigFieldType;
  handleDelete: (id: string) => void;
};

function Component(props: GenericFieldConfigProps) {
  // Define type groups and render the matching field component.
  const textFieldZodObj = textFieldSchema.safeParse(props.type);
  const optionFieldZodObj = optionFieldSchema.safeParse(props.type);
  const columnFieldZodObj = columnFieldSchema.safeParse(props.type);
  const toggleFieldZodObj = toggleFieldSchema.safeParse(props.type);

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
