CREATE TABLE `school` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`short_name` text,
	`logo_url` text,
	`address` text,
	`city` text,
	`country` text DEFAULT 'TD' NOT NULL,
	`phone` text,
	`email` text,
	`motto` text,
	`ministry_code` text,
	`school_type` text DEFAULT 'public' NOT NULL,
	`default_language` text DEFAULT 'fr' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `academic_year` (
	`id` text PRIMARY KEY NOT NULL,
	`school_id` text NOT NULL,
	`label` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`is_current` integer DEFAULT false NOT NULL,
	`grading_system` text DEFAULT 'trimesters' NOT NULL,
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`school_id` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login` integer,
	`created_at` integer NOT NULL,
	`digital_signature_cert` text,
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_school_id_username_unique` ON `user` (`school_id`,`username`);
