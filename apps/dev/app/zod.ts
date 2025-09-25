import { z } from "zod";

export const textFieldTypeSchema = z.enum([
  "TEXT",
  "NUMBER",
  "DATE",
  "EMAIL",
  "PHONE",
  "TEXTAREA",
]);
export const optionFieldTypeSchema = z.enum(["SELECT", "CHECKBOX", "RADIO"]);
export const columnFieldTypeSchema = z.literal("TABLE");
export const toggleFieldTypeSchema = z.literal("SWITCH");

export const baseFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  placeholder: z.string(),
});

export const textFieldSchema = baseFieldSchema.extend({
  type: textFieldTypeSchema,
  defaultValue: z.string(),
  regExp: z.string(),
  isRequired: z.boolean(),
});

export const optionFieldSchema = baseFieldSchema.extend({
  type: optionFieldTypeSchema,
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  defaultValue: z.string(),
  isRequired: z.boolean(),
});

export const columnFieldSchema = baseFieldSchema
  .omit({ placeholder: true })
  .extend({
    type: columnFieldTypeSchema,
    columns: z.array(
      z.object({
        label: z.string(),
        key: z.string(),
      }),
    ),
  });

export const toggleFieldSchema = baseFieldSchema.extend({
  type: toggleFieldTypeSchema,
  defaultValue: z.boolean(),
});

export const fieldSchema = z.union([
  textFieldSchema,
  optionFieldSchema,
  columnFieldSchema,
  toggleFieldSchema,
]);

export const configSchema = z.object({
  id: z.number(),
  configRef: z.string(),
  images: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      dataUrl: z.string(),
    }),
  ),
  title: z.string(),
  description: z.string(),
  fields: z.array(fieldSchema),
  ajvSchema: z.record(z.string(), z.any()),
  endpoint: z.object({
    url: z.string().url(),
    headers: z.array(z.object({ key: z.string(), value: z.string() })),
  }),
  formCode: z.string(),
  createdOn: z.string(),
  updatedOn: z.string().nullable(),
});

export const rawConfigSchema = configSchema.omit({
  id: true,
  configRef: true,
  ajvSchema: true,
  createdOn: true,
  updatedOn: true,
});

export const reviewPayloadSchema = z.object({
  images: z.array(z.string()),
  config: configSchema,
  schema: z.record(z.string(), z.any()),
});

export const uploadFormSchema = z.object({
  engine: z.enum(["GOOGLE", "LMSTUDIO", "OLLAMA", "OPENAI"]),
  configRef: z.string().length(36),
  images: z.array(z.string()).min(1),
});
