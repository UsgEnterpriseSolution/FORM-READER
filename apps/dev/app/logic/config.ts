import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "~/db/database";
import {
  tbConfig,
  type InsertConfig,
  type SelectConfig,
} from "~/db/schema/tbConfig";
import type { ConfigObj, FieldObj, RawConfig } from "~/types";
import {
  columnFieldSchema,
  optionFieldSchema,
  textFieldSchema,
  toggleFieldSchema,
} from "~/zod";

class Config {
  public static async getAll() {
    try {
      return await db.select().from(tbConfig);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async get(configId: string) {
    try {
      const result = await db
        .select()
        .from(tbConfig)
        .where(eq(tbConfig.configId, configId));

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async create(input: {
    configId: string;
    title: string;
    description: string;
    fields: InsertConfig["fields"];
    schema?: InsertConfig["schema"];
  }): Promise<SelectConfig | null> {
    try {
      const toInsert: InsertConfig = {
        configId: input.configId,
        title: input.title,
        description: input.description,
        fields: input.fields,
        schema: input.schema ?? {},
      };

      const res = await db.insert(tbConfig).values(toInsert).returning();
      return res[0] ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return null;
    }
  }

  public static async createBeta(rawConfig: RawConfig) {
    try {
      const newConfig: Omit<ConfigObj, "id"> = {
        ...rawConfig,
        configId: crypto.randomUUID(),
        schema: await this.genSchema(rawConfig.fields),
      };

      const result = await db.insert(tbConfig).values(newConfig).returning();
      return result[0] ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);

      return null;
    }
  }

  public static async update(
    configId: string,
    update: Partial<Omit<InsertConfig, "configId">>,
  ): Promise<SelectConfig | null> {
    try {
      const res = await db
        .update(tbConfig)
        .set(update)
        .where(eq(tbConfig.configId, configId))
        .returning();

      return res[0] ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return null;
    }
  }

  public static async updateBeta(configId: string, rawConfig: RawConfig) {
    try {
      const result = await db
        .update(tbConfig)
        .set(rawConfig)
        .where(eq(tbConfig.configId, configId))
        .returning();

      return result[0] ?? null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return null;
    }
  }

  public static async remove(configId: string): Promise<boolean> {
    try {
      const res = await db
        .delete(tbConfig)
        .where(eq(tbConfig.configId, configId));
      // drizzle returns info but not affectedRows with libsql; assume success if no throw
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return false;
    }
  }

  public static async genSchema(fields: FieldObj[]) {
    const properties: any = {};
    const required: string[] = [];

    for (const field of fields) {
      const textFieldZodObj = textFieldSchema.safeParse(field);
      if (textFieldZodObj.success) {
        const { name, type, defaultValue } = textFieldZodObj.data;

        if (type) {
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
          default: defaultValue,
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

  public static async isValidConfigId(configId: string): Promise<boolean> {
    try {
      const config = await db
        .select()
        .from(tbConfig)
        .where(eq(tbConfig.configId, configId))
        .limit(1);

      return config.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return false;
    }
  }
}

export default Config;
