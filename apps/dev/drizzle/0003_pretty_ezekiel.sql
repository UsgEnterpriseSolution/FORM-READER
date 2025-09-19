ALTER TABLE "tb_config" ALTER COLUMN "form_code" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tb_config" ADD CONSTRAINT "tb_config_form_code_unique" UNIQUE("form_code");