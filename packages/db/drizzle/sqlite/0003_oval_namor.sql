CREATE TABLE `family_member` (
	`id` text PRIMARY KEY NOT NULL,
	`teacher_id` text NOT NULL,
	`relation` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`date_of_birth` text,
	`phone` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `family_member_teacher_id_idx` ON `family_member` (`teacher_id`);--> statement-breakpoint
CREATE TABLE `parent` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`relation` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text,
	`email` text,
	`address` text,
	`occupation` text,
	`is_emergency_contact` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `parent_student_id_idx` ON `parent` (`student_id`);--> statement-breakpoint
CREATE INDEX `parent_student_id_relation_idx` ON `parent` (`student_id`,`relation`);--> statement-breakpoint
CREATE TABLE `salary` (
	`id` text PRIMARY KEY NOT NULL,
	`teacher_id` text NOT NULL,
	`amount` integer NOT NULL,
	`effective_date` text NOT NULL,
	`payment_date` text,
	`payment_method` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `salary_teacher_id_effective_date_unique` ON `salary` (`teacher_id`,`effective_date`);--> statement-breakpoint
CREATE INDEX `salary_teacher_id_idx` ON `salary` (`teacher_id`);--> statement-breakpoint
CREATE INDEX `salary_status_idx` ON `salary` (`status`);--> statement-breakpoint
CREATE INDEX `salary_payment_date_idx` ON `salary` (`payment_date`);--> statement-breakpoint
CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`school_id` text NOT NULL,
	`student_code` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`gender` text NOT NULL,
	`address` text,
	`phone` text,
	`email` text,
	`nationality` text,
	`profile_photo_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`enrollment_date` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `student_user_id_unique` ON `student` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_school_id_student_code_unique` ON `student` (`school_id`,`student_code`);--> statement-breakpoint
CREATE INDEX `student_school_id_idx` ON `student` (`school_id`);--> statement-breakpoint
CREATE TABLE `teacher` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`school_id` text NOT NULL,
	`employee_code` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`date_of_birth` text,
	`gender` text,
	`address` text,
	`phone` text,
	`email` text,
	`profile_photo_url` text,
	`hire_date` text,
	`years_of_experience` integer,
	`qualification` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_user_id_unique` ON `teacher` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_school_id_employee_code_unique` ON `teacher` (`school_id`,`employee_code`);--> statement-breakpoint
CREATE INDEX `teacher_school_id_idx` ON `teacher` (`school_id`);