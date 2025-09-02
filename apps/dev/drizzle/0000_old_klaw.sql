CREATE TABLE `tb_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`config_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`fields` text NOT NULL,
	`schema` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tb_config_config_id_unique` ON `tb_config` (`config_id`);--> statement-breakpoint
CREATE TABLE `tb_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data_id` text NOT NULL,
	`config_id` text,
	`data` text NOT NULL,
	`date_extracted` text NOT NULL,
	FOREIGN KEY (`config_id`) REFERENCES `tb_config`(`config_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tb_data_data_id_unique` ON `tb_data` (`data_id`);