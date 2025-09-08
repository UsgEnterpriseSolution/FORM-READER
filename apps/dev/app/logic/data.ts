import crypto from "node:crypto";

import { db } from "~/db/database";
import Config from "./config";
import { tbData } from "~/db/schema/tbData";
import { desc, eq } from "drizzle-orm";

type Submission = {
  [k: string]: FormDataEntryValue;
};

class Data {
  public static async parse(configId: string, submission: Submission) {
    try {
      const config = await Config.get(configId);

      if (config === null) {
        throw new Error("Invalid config ID");
      }

      const result: { [k: string]: any } = {};
      for (const field of config.fields) {
        const value = submission[field.name];

        if (value === undefined) {
          result[field.name] = null;
          continue;
        }

        if (field.type === "CHECKBOX") {
          result[field.name] = JSON.parse(value as string);
          continue;
        }

        result[field.name] = value;
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async insert(configId: string, data: { [k: string]: any }) {
    try {
      const result = await db
        .insert(tbData)
        .values({
          dataId: crypto.randomUUID(),
          configId,
          data,
          date_extracted: new Date().toISOString(),
        })
        .returning();

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async getAll() {
    try {
      const result = await db
        .select()
        .from(tbData)
        .orderBy(desc(tbData.date_extracted));

      return result.length > 0 ? result : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }
  public static async get(dataId: string) {
    try {
      const result = await db
        .select()
        .from(tbData)
        .where(eq(tbData.dataId, dataId))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async isValidId(id: string) {
    try {
      const result = await db
        .select()
        .from(tbData)
        .where(eq(tbData.dataId, id))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return false;
    }
  }
}

export default Data;
