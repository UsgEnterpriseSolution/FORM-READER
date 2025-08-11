import type { FormConfig, FormField } from "~/types";

export function generateAJVSchema(config: FormConfig | { name?: string; description?: string; fields: FormField[] }): object {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const field of config.fields || []) {
    const schemaForField = fieldToSchema(field);
    properties[field.name] = schemaForField;
    if (field.required) required.push(field.name);
  }

  const schema: any = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: config.name ?? "Form Data",
    description: config.description ?? undefined,
    type: "object",
    additionalProperties: false,
    properties,
  };

  if (required.length > 0) schema.required = required;

  return schema;
}

function fieldToSchema(field: FormField): object {
  const baseValidation = field.validation || {};

  switch (field.type) {
    case "text":
    case "textarea": {
      return attachStringValidation({ type: "string" }, baseValidation);
    }
    case "email": {
      return attachStringValidation({ type: "string", format: "email" }, baseValidation);
    }
    case "number": {
      const schema: any = { type: "number" };
      if (typeof baseValidation.min === "number") schema.minimum = baseValidation.min;
      if (typeof baseValidation.max === "number") schema.maximum = baseValidation.max;
      return schema;
    }
    case "select": {
      const values = (field.options || []).map((o: any) => o?.value).filter((v: any) => v !== undefined);
      const schema: any = { type: "string" };
      if (values.length > 0) schema.enum = values;
      return attachStringValidation(schema, baseValidation);
    }
    case "checkbox": {
      return { type: "boolean" };
    }
    default: {
      // Fallback to string with provided validation
      return attachStringValidation({ type: "string" }, baseValidation);
    }
  }
}

function attachStringValidation(schema: any, validation: Record<string, any>) {
  if (typeof validation.minLength === "number") schema.minLength = validation.minLength;
  if (typeof validation.maxLength === "number") schema.maxLength = validation.maxLength;
  if (typeof validation.pattern === "string" && validation.pattern.length > 0) schema.pattern = validation.pattern;
  return schema;
}

