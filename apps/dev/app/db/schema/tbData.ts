import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { tbConfig } from "./tbConfig";

export const tbData = sqliteTable("tb_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dataId: text("data_id").unique().notNull(),
  configId: text("config_id").references(() => tbConfig.configId, {
    onDelete: "cascade",
  }),
  data: text("data", { mode: "json" }).notNull(),
  date_extracted: text("date_extracted").notNull(),
});

export type InsertData = typeof tbData.$inferInsert;
export type SelectData = typeof tbData.$inferSelect;
