ALTER TABLE "tb_config" ALTER COLUMN "endpoint" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tb_config" ADD COLUMN "form_code" varchar DEFAULT '0000' NOT NULL;