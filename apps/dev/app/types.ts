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

// --- Engine types ---

export type Engine = "GOOGLE" | "LMSTUDIO" | "OLLAMA" | "OPENAI";

export type EngineList = {
  label: string;
  value: Engine;
  isLocal: boolean;
}[];

// --- Data Log types ---

export type DataLog = {
  id: number;
  dataRef: string;
  formTitle: string;
  extDate: string;
  branchCode: string;
  username: string;
  data: { [k: PropertyKey]: any };
};

export type DataLogMinified = {
  extDate: string;
  dataRef: string;
  formTitle: string;
};

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
  engines: EngineList;
};

export type ConfigLoaderRes = Array<{
  configRef: string;
  title: string;
  description: string;
  endpoint: string;
  formCode: string;
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

export type ConfigImg = {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
};

export type ConfigEndpointObj = {
  url: string;
  headers: { [key: string]: string };
};

// --- Field Types ---

export type BaseField = z.infer<typeof baseFieldSchema>;
export type TextField = z.infer<typeof textFieldSchema>;
export type OptionField = z.infer<typeof optionFieldSchema>;
export type ColumnField = z.infer<typeof columnFieldSchema>;
export type ToggleField = z.infer<typeof toggleFieldSchema>;

export type FieldObj = z.infer<typeof fieldSchema>;
export type RawConfig = z.infer<typeof rawConfigSchema>;
export type ConfigObj = z.infer<typeof configSchema>;

// --- Editor Types ---

export type EditorDetails = {
  method: "POST" | "PUT" | "GET";
  title: string;
  description: string;
  submitLabel: string;
};

// --- Helpers ---

export type Discriminated<T> = {
  [K in keyof T]: { key: K; value: T[K] };
}[keyof T];
