CREATE TABLE "tb_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_ref" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"fields" jsonb NOT NULL,
	"ajv_schema" jsonb NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"updated_on" timestamp,
	CONSTRAINT "tb_config_config_ref_unique" UNIQUE("config_ref")
);
--> statement-breakpoint
CREATE TABLE "tb_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"data_ref" uuid DEFAULT gen_random_uuid() NOT NULL,
	"config_ref" uuid NOT NULL,
	"username" varchar NOT NULL,
	"branch_code" varchar NOT NULL,
	"data" jsonb NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tb_data" ADD CONSTRAINT "tb_data_config_ref_tb_config_config_ref_fk" FOREIGN KEY ("config_ref") REFERENCES "public"."tb_config"("config_ref") ON DELETE cascade ON UPDATE no action;