import {
  pgTable,
  serial,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { tbConfig } from "./tbConfig";

export const tbData = pgTable("tb_data", {
  id: serial("id").primaryKey(),
  dataRef: uuid("data_ref").defaultRandom().notNull(),
  configRef: uuid("config_ref")
    .notNull()
    .references(() => tbConfig.configRef, {
      onDelete: "cascade",
    }),
  username: varchar("username").notNull(),
  branchCode: varchar("branch_code").notNull(),
  data: jsonb("data").$type<Record<string, any>>().notNull(),
  createdOn: timestamp("created_on", { mode: "string" }).defaultNow().notNull(),
});

export type SelectData = typeof tbData.$inferSelect;
export type InsertData = typeof tbData.$inferInsert;
