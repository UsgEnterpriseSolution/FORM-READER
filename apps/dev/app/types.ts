import { z } from "zod";
import type { fieldDataSchema, uploadActionDataSchema } from "./zod";

// Form types

export type FieldData = z.infer<typeof fieldDataSchema>;

export type Engine = "GOOGLE" | "LMSTUDIO" | "OLLAMA";

// Response types

export type ActionRes<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "fail";
      message: string;
    }
  | {
      status: "error";
      message: string;
      code: number;
    };

export type UploadActionRes = z.infer<typeof uploadActionDataSchema>;

// Config Types

type BaseField = {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  validation: FieldValidation;
};

type FieldValidation = {
  isRequired: boolean;
  regExp: string;
};

type TextField = {
  type: "text" | "email" | "number";
} & BaseField;

type TextareaField = {
  type: "textarea";
} & BaseField;

type Options = {
  value: string;
  label: string;
};

type SelectField = {
  type: "select";
  options: Options[];
} & BaseField;

type CheckboxField = {
  type: "checkbox";
  name: string;
  label: string;
  defaultValue: boolean;
};

export type Fields = TextField | TextareaField | SelectField | CheckboxField;
