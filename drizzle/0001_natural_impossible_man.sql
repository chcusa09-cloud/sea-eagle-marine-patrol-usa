CREATE TABLE `installments` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`amount` integer NOT NULL,
	`due_date` text NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `installments_plan` ON `installments` (`plan_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`charge_id` text NOT NULL,
	`paid_baseline` integer NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`charge_id`) REFERENCES `charges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plans_charge_id_unique` ON `plans` (`charge_id`);