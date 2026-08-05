ALTER TABLE "issues" ADD COLUMN "due_date" timestamp;--> statement-breakpoint
CREATE INDEX "issues_project_idx" ON "issues" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "issues_created_idx" ON "issues" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "pages_project_idx" ON "pages" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "pages_position_idx" ON "pages" USING btree ("position");