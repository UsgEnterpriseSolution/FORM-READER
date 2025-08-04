import { eq } from "drizzle-orm";
import { db } from "~/db/database";
import { tbConfig } from "~/db/schema/tbConfig";

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
}

export default Config;
