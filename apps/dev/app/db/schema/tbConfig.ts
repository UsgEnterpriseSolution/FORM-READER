import {
  pgTable,
  serial,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import type { ConfigEndpointObj, ConfigImg, FieldObj } from "~/types";

export const tbConfig = pgTable("tb_config", {
  id: serial("id").primaryKey(),
  configRef: uuid("config_ref").defaultRandom().unique().notNull(),
  images: jsonb("images").$type<ConfigImg[]>().notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  fields: jsonb("fields").$type<FieldObj[]>().notNull(),
  ajvSchema: jsonb("ajv_schema").$type<Record<string, any>>().notNull(),
  endpoint: jsonb("endpoint").$type<ConfigEndpointObj>().notNull(),
  formCode: varchar("form_code").unique().notNull(),
  createdOn: timestamp("created_on", { mode: "string" }).defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "string" }),
});

export type SelectConfig = typeof tbConfig.$inferSelect;
export type InsertConfig = typeof tbConfig.$inferInsert;
