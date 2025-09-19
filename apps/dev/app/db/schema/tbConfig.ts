import {
  pgTable,
  serial,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import type { FieldObj } from "~/types";

export const tbConfig = pgTable("tb_config", {
  id: serial("id").primaryKey(),
  configRef: uuid("config_ref").defaultRandom().unique().notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  fields: jsonb("fields").$type<FieldObj[]>().notNull(),
  ajvSchema: jsonb("ajv_schema").$type<Record<string, any>>().notNull(),
  endpoint: varchar("endpoint").notNull(),
  formCode: varchar("form_code").unique().notNull(),
  createdOn: timestamp("created_on", { mode: "string" }).defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "string" }),
});

export type SelectConfig = typeof tbConfig.$inferSelect;
export type InsertConfig = typeof tbConfig.$inferInsert;
