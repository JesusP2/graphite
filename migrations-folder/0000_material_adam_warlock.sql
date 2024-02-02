CREATE TABLE `sessions` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `users` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191),
	`email` varchar(191) NOT NULL,
	`emailVerified` timestamp,
	`image` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `verification_tokens` (
	`identifier` varchar(191) PRIMARY KEY NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `sessions__sessionToken__idx` ON `sessions` (`sessionToken`);
CREATE INDEX `sessions__userId__idx` ON `sessions` (`userId`);
CREATE UNIQUE INDEX `users__email__idx` ON `users` (`email`);
CREATE UNIQUE INDEX `verification_tokens__token__idx` ON `verification_tokens` (`token`);