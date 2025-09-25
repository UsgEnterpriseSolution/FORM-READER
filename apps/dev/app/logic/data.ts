import { db } from "~/db/database";
import Config from "./config";
import { tbData } from "~/db/schema/tbData";
import { desc, eq } from "drizzle-orm";

type Submission = {
  [k: string]: FormDataEntryValue;
};

class Data {
  public static async parse(configRef: string, submission: Submission) {
    try {
      const config = await Config.get(configRef);

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

  public static async insert(
    configRef: string,
    dataRef: string,
    user: { branchCode: string; username: string },
    data: { [k: string]: any },
  ) {
    try {
      const result = await db
        .insert(tbData)
        .values({
          dataRef,
          configRef,
          data,
          username: user.username,
          branchCode: user.branchCode,
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

  public static async all() {
    try {
      const result = await db
        .select()
        .from(tbData)
        .orderBy(desc(tbData.createdOn));

      return result.length > 0 ? result : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }
  public static async get(dataRef: string) {
    try {
      const result = await db
        .select()
        .from(tbData)
        .where(eq(tbData.dataRef, dataRef))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async isValid(dataRef: string) {
    try {
      const result = await db
        .select()
        .from(tbData)
        .where(eq(tbData.dataRef, dataRef))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return false;
    }
  }

  public static async send(
    configRef: string,
    dataRef: string,
    user: { branchCode: string; username: string },
    data: { [k: string]: any },
  ) {
    try {
      const config = await Config.get(configRef);
      if (config === null) {
        throw new Error("Config not found.");
      }

      if (!config.endpoint) {
        throw new Error("Endpoint not found.");
      }

      const res = await fetch(config.endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.endpoint.headers,
        },
        body: JSON.stringify({
          formCode: config.formCode,
          data,
          branchCode: user.branchCode,
          postedBy: user.username,
          reference: dataRef,
        }),
      });

      if (!res.ok) {
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return false;
    }
  }
}

export default Data;
