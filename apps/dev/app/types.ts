import type { SelectConfig } from "./db/schema/tbConfig";

// Generic types

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

export type ConfigLoaderRes = Array<{
  configId: string;
  title: string;
  description: string;
  lastUpdated: string;
}>;

export type ReviewLoaderRes = {
  images: string[];
  config: SelectConfig | null;
  fieldData: object;
};

// Config Types

export type ConfigFieldType =
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "EMAIL"
  | "PHONE"
  | "TEXTAREA"
  | "SELECT"
  | "CHECKBOX"
  | "RADIO"
  | "TABLE"
  | "SWITCH";

export type ConfigFieldObj = {
  id: string;
  type: ConfigFieldType;
};

type BaseField = {
  name: string;
  label: string;
  placeholder: string;
};

export type TextField = BaseField & {
  type: "TEXT" | "NUMBER" | "DATE" | "EMAIL" | "PHONE" | "TEXTAREA";
  defaultValue: string;
  regExp: string;
  isRequired: boolean;
};

export type OptionField = BaseField & {
  type: "SELECT" | "CHECKBOX" | "RADIO";
  options: Array<{
    label: string;
    value: string;
  }>;
  defaultValue: string;
  isRequired: boolean;
};

export type ColumnField = Omit<BaseField, "placeholder"> & {
  type: "TABLE";
  columns: Array<{
    label: string;
    key: string;
  }>;
};

export type ToggleField = BaseField & {
  type: "SWITCH";
  defaultValue: boolean;
};

export type Field = TextField | OptionField | ColumnField | ToggleField;

// New Configuration Data Model (per project rules Step 2)
export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: any[];
  validation?: Record<string, any>;
}

export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  created: Date;
  modified: Date;
}
