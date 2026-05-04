CREATE UNIQUE INDEX `class_level_school_id_name_unique` ON `class_level` (`school_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `subject_school_id_code_unique` ON `subject` (`school_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `term_academic_year_id_label_unique` ON `term` (`academic_year_id`,`label`);