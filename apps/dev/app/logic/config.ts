import { eq } from "drizzle-orm";
import { db } from "~/db/database";
import { tbConfig, type InsertConfig, type SelectConfig } from "~/db/schema/tbConfig";

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

  public static async update(configId: string, update: Partial<Omit<InsertConfig, "configId">>): Promise<SelectConfig | null> {
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

  public static async remove(configId: string): Promise<boolean> {
    try {
      const res = await db.delete(tbConfig).where(eq(tbConfig.configId, configId));
      // drizzle returns info but not affectedRows with libsql; assume success if no throw
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error);
      return false;
    }
  }
}

export default Config;
