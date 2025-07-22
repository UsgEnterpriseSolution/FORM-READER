import { z } from "zod";
import type { fieldDataSchema, uploadActionDataSchema } from "./zod";

export type FieldData = z.infer<typeof fieldDataSchema>;

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
