CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`workos_id` varchar(191) NOT NULL,
	`avatar` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users__workos_id__idx` UNIQUE(`workos_id`)
);

DROP TABLE `bloqued_users`;
ALTER TABLE `users_to_organizations` ADD `status` enum('Blocked','Active','Disabled') NOT NULL;
ALTER TABLE `users_to_organizations` ADD `role` enum('Admin','Owner','Member') NOT NULL;
ALTER TABLE `users_to_organizations` ADD `created_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `users_to_organizations` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;