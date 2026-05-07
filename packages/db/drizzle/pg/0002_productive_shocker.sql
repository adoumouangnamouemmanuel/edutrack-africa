ALTER TABLE "class_level" ALTER COLUMN "order" TYPE integer USING "order"::integer;--> statement-breakpoint
CREATE INDEX "term_academic_year_id_idx" ON "term" USING btree ("academic_year_id");--> statement-breakpoint
CREATE INDEX "term_is_current_idx" ON "term" USING btree ("is_current");--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_school_id_code_unique" UNIQUE("school_id","code");--> statement-breakpoint
ALTER TABLE "term" ADD CONSTRAINT "term_academic_year_id_label_unique" UNIQUE("academic_year_id","label");