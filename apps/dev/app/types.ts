import { z } from "zod";
import type { fieldDataSchema } from "./zod";
import type { SelectConfig } from "./db/schema/tbConfig";

// Generic types

export type FieldData = z.infer<typeof fieldDataSchema>; // # Delete

export type Engine = "GOOGLE" | "LMSTUDIO" | "OLLAMA";

// Response types

export type AppResponse<T> =
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

export type UploadLoaderRes = {
  configs: Array<{
    label: string;
    value: string;
  }>;
  engines: Array<{
    label: string;
    value: Engine;
  }>;
};

export type ReviewLoaderRes = {
  images: string[];
  config: SelectConfig | null;
  fieldData: object;
};

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
  type: "text" | "email" | "number" | "phone";
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

export type Field = TextField | TextareaField | SelectField | CheckboxField;
