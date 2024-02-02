CREATE TABLE `accounts` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191),
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`provider_account_id` varchar(191) NOT NULL,
	`access_token` text,
	`expires_in` int,
	`id_token` text,
	`refresh_token` text,
	`refresh_token_expires_in` int,
	`scope` varchar(191),
	`token_type` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts__provider__providerAccountId__idx` UNIQUE(`provider`,`provider_account_id`)
);

CREATE TABLE `comments` (
	`id` varchar(191) NOT NULL,
	`suite_run_id` varchar(191),
	`test_run_id` varchar(191),
	`user_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);

CREATE TABLE `cronjobs` (
	`id` varchar(191) NOT NULL,
	`suite_id` varchar(191) NOT NULL,
	`cron` varchar(191) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cronjobs_id` PRIMARY KEY(`id`)
);

CREATE TABLE `organizations` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);

CREATE TABLE `projects` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`org_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);

CREATE TABLE `sessions` (
	`id` varchar(191) NOT NULL,
	`session_token` varchar(191) NOT NULL,
	`user_id` varchar(191),
	`expires` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions__session_token__idx` UNIQUE(`session_token`)
);

CREATE TABLE `steps` (
	`id` varchar(191) NOT NULL,
	`test_id` varchar(191) NOT NULL,
	`step_number` int NOT NULL,
	`selector` text,
	`action` enum('Click','MouseHover','Assign','Keypress','Pause','Exit','GoToURL','GoBack','Refresh') NOT NULL,
	`click` enum('Left','Middle','Right','Double Left'),
	`assign` text,
	`keypress` enum('Enter','Tab','Escape','Space'),
	`go_to_url` text,
	`pause` int,
	`is_optional` boolean NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `steps_id` PRIMARY KEY(`id`)
);

CREATE TABLE `steps_runs` (
	`id` varchar(191) NOT NULL,
	`step_id` varchar(191) NOT NULL,
	`test_id` varchar(191) NOT NULL,
	`test_run_id` varchar(191) NOT NULL,
	`step_number` int NOT NULL,
	`selector` text,
	`action` enum('Click','MouseHover','Assign','Keypress','Pause','Exit','GoToURL','GoBack','Refresh') NOT NULL,
	`click` enum('Left','Middle','Right','Double Left'),
	`assign` text,
	`keypress` enum('Enter','Tab','Escape','Space'),
	`go_to_url` text,
	`pause` int,
	`status` enum('Passed','Failed','Unknown') NOT NULL,
	`is_optional` boolean NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `steps_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `steps_runs__test_run_id__step_id` UNIQUE(`test_run_id`,`step_id`)
);

CREATE TABLE `suites` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`project_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suites_id` PRIMARY KEY(`id`)
);

CREATE TABLE `suites_runs` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`suite_id` varchar(191) NOT NULL,
	`triggered_by` varchar(191) NOT NULL,
	`duration` int NOT NULL,
	`status` enum('running','passed','failed','aborted') NOT NULL,
	`start_url` text NOT NULL,
	`end_url` text NOT NULL,
	`video_url` text NOT NULL,
	`user_agent` text NOT NULL,
	`view_port` text NOT NULL,
	`tests_passed` int NOT NULL,
	`tests_failed` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completed_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suites_runs_id` PRIMARY KEY(`id`)
);

CREATE TABLE `tests` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`suite_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tests_id` PRIMARY KEY(`id`)
);

CREATE TABLE `test_runs` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`test_id` varchar(191) NOT NULL,
	`suite_id` varchar(191) NOT NULL,
	`suite_run_id` varchar(191) NOT NULL,
	`status` enum('Passed','Failed','Unknown') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `test_runs_id` PRIMARY KEY(`id`)
);

CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191) NOT NULL,
	`email_verified` timestamp,
	`image` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users__email__idx` UNIQUE(`email`)
);

CREATE TABLE `users_to_organizations` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`org_id` varchar(191) NOT NULL,
	CONSTRAINT `users_to_organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_to_organizations__user_id__org_id__idx` UNIQUE(`user_id`,`org_id`)
);

CREATE TABLE `verification_tokens` (
	`id` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `verification_tokens__token__idx` UNIQUE(`token`)
);

CREATE INDEX `accounts__user_id__idx` ON `accounts` (`user_id`);
CREATE INDEX `comments__run_id__idx` ON `comments` (`suite_run_id`);
CREATE INDEX `comments__test_id__idx` ON `comments` (`test_run_id`);
CREATE INDEX `cronjobs__suite_id__idx` ON `cronjobs` (`suite_id`);
CREATE INDEX `projects__org_id__idx` ON `projects` (`org_id`);
CREATE INDEX `sessions__userId__idx` ON `sessions` (`user_id`);
CREATE INDEX `steps__test_id__idx` ON `steps` (`test_id`);
CREATE INDEX `steps__test_id__idx` ON `steps_runs` (`test_id`);
CREATE INDEX `suites__project_id__idx` ON `suites` (`project_id`);
CREATE INDEX `runs__suite_id__idx` ON `suites_runs` (`suite_id`);
CREATE INDEX `tests__suite_id__idx` ON `tests` (`suite_id`);
CREATE INDEX `tests__suite_id__idx` ON `test_runs` (`suite_id`);
CREATE INDEX `tests__suite_run_id__idx` ON `test_runs` (`suite_run_id`);