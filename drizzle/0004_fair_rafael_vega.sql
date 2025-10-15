CREATE TABLE `homepage_about_section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text,
	`button_text` text,
	`button_link` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `homepage_featured_dishes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` text NOT NULL,
	`image_url` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `homepage_featured_section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_title` text NOT NULL,
	`section_description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `homepage_features` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`icon` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `homepage_hero` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`primary_button_text` text,
	`primary_button_link` text,
	`secondary_button_text` text,
	`secondary_button_link` text,
	`background_image_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
