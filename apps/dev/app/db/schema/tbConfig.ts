import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { Fields } from "~/types";

export const tbConfig = sqliteTable("tb_config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  configId: text("config_id").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fields: text("fields", { mode: "json" }).notNull().$type<Fields[]>(),
});

export type InsertConfig = typeof tbConfig.$inferInsert;
export type SelectConfig = typeof tbConfig.$inferSelect;
