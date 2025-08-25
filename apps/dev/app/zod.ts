import { z } from "zod";

export const fieldSchema = z.object({});

export const config = z.object({
  id: z.number(),
  configId: z.string(),
  title: z.string(),
  description: z.string(),
  fields: z.array(fieldSchema),
});

export const reviewPayloadSchema = z.object({
  images: z.array(z.string()),
  config: config,
  schema: z.object({}),
});

export const textFieldSchema = z.enum([
  "TEXT",
  "NUMBER",
  "DATE",
  "EMAIL",
  "PHONE",
  "TEXTAREA",
]);

export const optionFieldSchema = z.enum(["SELECT", "CHECKBOX", "RADIO"]);

export const columnFieldSchema = z.enum(["TABLE"]);

export const toggleFieldSchema = z.enum(["SWITCH"]);
