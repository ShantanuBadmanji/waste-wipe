ALTER TABLE `COMPLAINT` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `COMPLAINT` ADD `modified_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;