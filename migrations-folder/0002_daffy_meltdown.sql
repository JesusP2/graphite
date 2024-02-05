CREATE TABLE `bloqued_users` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`org_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bloqued_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `bloqued_users__user_id__org_id__idx` UNIQUE(`user_id`,`org_id`)
);

ALTER TABLE `organization_invites_requests` RENAME COLUMN `org_id` TO `domain`;
DROP INDEX `invites__org_id__idx` ON `organization_invites_requests`;
ALTER TABLE `organization_invites_requests` ADD CONSTRAINT `organization_invites_requests_domain_unique` UNIQUE(`domain`);
ALTER TABLE `organization_invites_requests` ADD CONSTRAINT `invites__domain__idx` UNIQUE(`domain`);
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_domain_unique` UNIQUE(`domain`);