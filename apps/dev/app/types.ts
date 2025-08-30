import type z from "zod";
import type { SelectConfig } from "./db/schema/tbConfig";
import type {
  baseFieldSchema,
  columnFieldSchema,
  columnFieldTypeSchema,
  configSchema,
  fieldSchema,
  optionFieldSchema,
  optionFieldTypeSchema,
  rawConfigSchema,
  textFieldSchema,
  textFieldTypeSchema,
  toggleFieldSchema,
  toggleFieldTypeSchema,
} from "./zod";

// --- Generic types ---

export type Engine = "GOOGLE" | "LMSTUDIO" | "OLLAMA";

// --- Response types ---

export type AppResponse<T> =
  | {
      status: "success";
      message?: string;
      data: T;
      timestamp: number;
    }
  | {
      status: "fail";
      message: string;
      timestamp: number;
    }
  | {
      status: "error";
      message: string;
      code: number;
      timestamp: number;
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

// --- Config Types ---

export type ConfigFieldType =
  | z.infer<typeof textFieldTypeSchema>
  | z.infer<typeof optionFieldTypeSchema>
  | z.infer<typeof columnFieldTypeSchema>
  | z.infer<typeof toggleFieldTypeSchema>;

export type ConfigFieldObj = {
  id: string;
  type: ConfigFieldType;
};

export type BaseField = z.infer<typeof baseFieldSchema>;
export type TextField = z.infer<typeof textFieldSchema>;
export type OptionField = z.infer<typeof optionFieldSchema>;
export type ColumnField = z.infer<typeof columnFieldSchema>;
export type ToggleField = z.infer<typeof toggleFieldSchema>;

export type FieldObj = z.infer<typeof fieldSchema>;
export type RawConfig = z.infer<typeof rawConfigSchema>;
export type ConfigObj = z.infer<typeof configSchema>;

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
