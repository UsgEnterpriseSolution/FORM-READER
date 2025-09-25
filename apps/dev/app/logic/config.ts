import { eq } from "drizzle-orm";
import { db } from "~/db/database";
import { tbConfig } from "~/db/schema/tbConfig";
import type { FieldObj, RawConfig } from "~/types";
import {
  columnFieldSchema,
  optionFieldSchema,
  textFieldSchema,
  toggleFieldSchema,
} from "~/zod";

class Config {
  public static async all() {
    try {
      return await db.select().from(tbConfig).orderBy(tbConfig.createdOn);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async get(configRef: string) {
    try {
      const result = await db
        .select()
        .from(tbConfig)
        .where(eq(tbConfig.configRef, configRef));

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async create(rawConfig: RawConfig) {
    try {
      const ajvSchema = await this.ajvSchema(rawConfig.fields);

      const result = await db
        .insert(tbConfig)
        .values({ ...rawConfig, ajvSchema })
        .returning();

      return result[0] ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async update(configRef: string, rawConfig: RawConfig) {
    try {
      const result = await db
        .update(tbConfig)
        .set({
          ...rawConfig,
          ajvSchema: await this.ajvSchema(rawConfig.fields),
        })
        .where(eq(tbConfig.configRef, configRef))
        .returning();

      return result[0] ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return null;
    }
  }

  public static async remove(configRef: string): Promise<boolean> {
    try {
      await db.delete(tbConfig).where(eq(tbConfig.configRef, configRef));
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return false;
    }
  }

  public static async ajvSchema(fields: FieldObj[]) {
    const properties: any = {};
    const required: string[] = [];

    for (const field of fields) {
      const textFieldZodObj = textFieldSchema.safeParse(field);
      if (textFieldZodObj.success) {
        const { name, type, defaultValue } = textFieldZodObj.data;

        if (type === "NUMBER") {
          properties[name] = {
            type: "number",
            default: defaultValue,
          };

          required.push(name);
          continue;
        }

        properties[name] = {
          type: "string",
          default: defaultValue,
        };

        required.push(name);
      }

      const optionFieldZodObj = optionFieldSchema.safeParse(field);
      if (optionFieldZodObj.success) {
        const { name, options, defaultValue } = optionFieldZodObj.data;

        properties[name] = {
          type: "string",
          enum: options.map((option) => option.value),
          default: options.map((option) => option.value).includes(defaultValue)
            ? defaultValue
            : "",
        };

        required.push(name);
      }

      const columnFieldZodObj = columnFieldSchema.safeParse(field);
      if (columnFieldZodObj.success) {
        const { name, columns } = columnFieldZodObj.data;
        const columnProps: any = {};

        for (const column of columns) {
          columnProps[column.key] = {
            type: "string",
          };
        }

        properties[name] = {
          type: "array",
          items: {
            type: "object",
            properties: columnProps,
          },
        };

        required.push(name);
      }

      const toggleFieldZodObj = toggleFieldSchema.safeParse(field);
      if (toggleFieldZodObj.success) {
        const { name } = toggleFieldZodObj.data;

        properties[name] = {
          type: "boolean",
          default: false,
        };

        required.push(name);
      }
    }

    return {
      type: "object",
      properties,
      required,
      additionalProperties: false,
    };
  }

  public static async isValid(configRef: string): Promise<boolean> {
    try {
      const config = await db
        .select()
        .from(tbConfig)
        .where(eq(tbConfig.configRef, configRef))
        .limit(1);

      return config.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return false;
    }
  }

  public static async formCodeCheck(formCode: string) {
    try {
      const config = await db
        .select()
        .from(tbConfig)
        .where(eq(tbConfig.formCode, formCode));

      switch (config.length) {
        case 0:
          return {
            exists: false,
            configRef: "",
          };
        case 1:
          return {
            exists: true,
            configRef: config[0].configRef,
          };
        default:
          throw new Error("Duplicate form code found.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return {
        exists: true,
        configRef: "",
      };
    }
  }

  public static async title(configRef: string) {
    try {
      const config = await db
        .select({ title: tbConfig.title })
        .from(tbConfig)
        .where(eq(tbConfig.configRef, configRef))
        .limit(1);
      return config[0]?.title ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return null;
    }
  }
}

export default Config;
