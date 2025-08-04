CREATE TABLE `tb_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`config_id` text NOT NULL,
	`title` text NOT NULL,
	`fields` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tb_config_config_id_unique` ON `tb_config` (`config_id`);