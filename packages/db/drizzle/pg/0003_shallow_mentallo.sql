CREATE TABLE "family_member" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"relation" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"relation" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"occupation" text,
	"is_emergency_contact" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"amount" integer NOT NULL,
	"effective_date" text NOT NULL,
	"payment_date" text,
	"payment_method" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "salary_teacher_id_effective_date_unique" UNIQUE("teacher_id","effective_date")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"school_id" text NOT NULL,
	"student_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"gender" text NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"nationality" text,
	"profile_photo_url" text,
	"status" text DEFAULT 'active' NOT NULL,
	"enrollment_date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "student_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "student_school_id_student_code_unique" UNIQUE("school_id","student_code")
);
--> statement-breakpoint
CREATE TABLE "teacher" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"school_id" text NOT NULL,
	"employee_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text,
	"gender" text,
	"years_of_experience" integer,
	"phone" text,
	"email" text,
	"profile_photo_url" text,
	"hire_date" text,
	"qualification" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "teacher_school_id_employee_code_unique" UNIQUE("school_id","employee_code")
);
--> statement-breakpoint
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_teacher_id_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent" ADD CONSTRAINT "parent_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary" ADD CONSTRAINT "salary_teacher_id_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "family_member_teacher_id_idx" ON "family_member" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "parent_student_id_idx" ON "parent" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "parent_student_id_relation_idx" ON "parent" USING btree ("student_id","relation");--> statement-breakpoint
CREATE INDEX "salary_teacher_id_idx" ON "salary" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "salary_status_idx" ON "salary" USING btree ("status");--> statement-breakpoint
CREATE INDEX "salary_payment_date_idx" ON "salary" USING btree ("payment_date");--> statement-breakpoint
CREATE INDEX "student_school_id_idx" ON "student" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "teacher_school_id_idx" ON "teacher" USING btree ("school_id");