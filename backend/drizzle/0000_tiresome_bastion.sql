CREATE TABLE
	`ADMIN` (
		`id` int unsigned AUTO_INCREMENT NOT NULL,
		`name` varchar(50) NOT NULL,
		`email_id` varchar(50) NOT NULL,
		`password` varchar(25) NOT NULL,
		CONSTRAINT `ADMIN_id` PRIMARY KEY (`id`),
		CONSTRAINT `ADMIN_email_id_unique` UNIQUE (`email_id`)
	);

--> statement-breakpoint
CREATE TABLE
	`AFTER_IMAGE` (
		`id` tinyint NOT NULL,
		`complaint_id` int unsigned NOT NULL,
		`url` varchar(500),
		CONSTRAINT `AFTER_IMAGE_id_complaint_id` PRIMARY KEY (`id`, `complaint_id`)
	);

--> statement-breakpoint
CREATE TABLE
	`BEFORE_IMAGE` (
		`id` tinyint NOT NULL,
		`complaint_id` int unsigned NOT NULL,
		`url` varchar(500),
		CONSTRAINT `BEFORE_IMAGE_id_complaint_id` PRIMARY KEY (`id`, `complaint_id`)
	);

--> statement-breakpoint
CREATE TABLE
	`COMPLAINT` (
		`id` int unsigned AUTO_INCREMENT NOT NULL,
		`token` varchar(100) NOT NULL,
		`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
		`wastetype_id` tinyint,
		`status_id` tinyint,
		`user_id` int unsigned,
		`emp_id` int unsigned,
		CONSTRAINT `COMPLAINT_id` PRIMARY KEY (`id`),
		CONSTRAINT `COMPLAINT_token_unique` UNIQUE (`token`)
	);

--> statement-breakpoint
CREATE TABLE
	`COMPLAINT_STATUS` (
		`id` tinyint NOT NULL,
		`status_name` varchar(50) NOT NULL,
		CONSTRAINT `COMPLAINT_STATUS_id` PRIMARY KEY (`id`),
		CONSTRAINT `COMPLAINT_STATUS_status_name_unique` UNIQUE (`status_name`)
	);

--> statement-breakpoint
CREATE TABLE
	`EMPLOYEE` (
		`id` int unsigned AUTO_INCREMENT NOT NULL,
		`name` varchar(50) NOT NULL,
		`email_id` varchar(50) NOT NULL,
		`password` varchar(25) NOT NULL,
		`capacity_kg` int unsigned,
		`contact_info` varchar(12),
		CONSTRAINT `EMPLOYEE_id` PRIMARY KEY (`id`),
		CONSTRAINT `EMPLOYEE_email_id_unique` UNIQUE (`email_id`)
	);

--> statement-breakpoint
CREATE TABLE
	`GPS_LOCATION` (
		`complaint_id` int unsigned NOT NULL,
		`area` varchar(25),
		`address` varchar(100),
		`city` varchar(50),
		`longitude` float,
		`latitude` float,
		CONSTRAINT `GPS_LOCATION_complaint_id` PRIMARY KEY (`complaint_id`)
	);

--> statement-breakpoint
CREATE TABLE
	`USER` (
		`id` int unsigned AUTO_INCREMENT NOT NULL,
		`name` varchar(50) NOT NULL,
		`email_id` varchar(50) NOT NULL,
		`password` varchar(25) NOT NULL,
		CONSTRAINT `USER_id` PRIMARY KEY (`id`),
		CONSTRAINT `USER_email_id_unique` UNIQUE (`email_id`)
	);

--> statement-breakpoint
CREATE TABLE
	`WASTE_TYPE` (
		`id` tinyint AUTO_INCREMENT NOT NULL,
		`type_name` varchar(50) NOT NULL,
		CONSTRAINT `WASTE_TYPE_id` PRIMARY KEY (`id`),
		CONSTRAINT `WASTE_TYPE_type_name_unique` UNIQUE (`type_name`)
	);

--> statement-breakpoint
CREATE INDEX `complaint_id` ON `AFTER_IMAGE` (`complaint_id`);

--> statement-breakpoint
CREATE INDEX `complaint_id` ON `BEFORE_IMAGE` (`complaint_id`);

--> statement-breakpoint
CREATE INDEX `emp_id` ON `COMPLAINT` (`emp_id`);

--> statement-breakpoint
CREATE INDEX `user_id` ON `COMPLAINT` (`user_id`);

--> statement-breakpoint
CREATE INDEX `wastetype_id` ON `COMPLAINT` (`wastetype_id`);

--> statement-breakpoint
ALTER TABLE `AFTER_IMAGE` ADD CONSTRAINT `AFTER_IMAGE_complaint_id_COMPLAINT_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `COMPLAINT` (`id`) ON DELETE cascade ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE `BEFORE_IMAGE` ADD CONSTRAINT `BEFORE_IMAGE_complaint_id_COMPLAINT_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `COMPLAINT` (`id`) ON DELETE cascade ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE `COMPLAINT` ADD CONSTRAINT `COMPLAINT_wastetype_id_WASTE_TYPE_id_fk` FOREIGN KEY (`wastetype_id`) REFERENCES `WASTE_TYPE` (`id`) ON DELETE set null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE `COMPLAINT` ADD CONSTRAINT `COMPLAINT_status_id_COMPLAINT_STATUS_id_fk` FOREIGN KEY (`status_id`) REFERENCES `COMPLAINT_STATUS` (`id`) ON DELETE set null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE `COMPLAINT` ADD CONSTRAINT `COMPLAINT_user_id_USER_id_fk` FOREIGN KEY (`user_id`) REFERENCES `USER` (`id`) ON DELETE set null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE `COMPLAINT` ADD CONSTRAINT `COMPLAINT_emp_id_EMPLOYEE_id_fk` FOREIGN KEY (`emp_id`) REFERENCES `EMPLOYEE` (`id`) ON DELETE set null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE `GPS_LOCATION` ADD CONSTRAINT `GPS_LOCATION_complaint_id_COMPLAINT_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `COMPLAINT` (`id`) ON DELETE cascade ON UPDATE cascade;