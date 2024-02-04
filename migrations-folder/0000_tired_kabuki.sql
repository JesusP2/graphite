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

CREATE TABLE `organization_invites_requests` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`org_id` varchar(191) NOT NULL,
	`type` enum('Invite','Request') NOT NULL,
	`status` enum('Pending','Approved','Rejected') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organization_invites_requests_id` PRIMARY KEY(`id`)
);

CREATE TABLE `organizations` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text NOT NULL,
	`logo` text NOT NULL,
	`domain` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations__domain__idx` UNIQUE(`domain`)
);

CREATE TABLE `projects` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`org_id` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
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

CREATE TABLE `users_to_organizations` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`org_id` varchar(191) NOT NULL,
	CONSTRAINT `users_to_organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_to_organizations__user_id__org_id__idx` UNIQUE(`user_id`,`org_id`)
);

CREATE INDEX `comments__run_id__idx` ON `comments` (`suite_run_id`);
CREATE INDEX `comments__test_id__idx` ON `comments` (`test_run_id`);
CREATE INDEX `cronjobs__suite_id__idx` ON `cronjobs` (`suite_id`);
CREATE INDEX `invites__org_id__idx` ON `organization_invites_requests` (`org_id`);
CREATE INDEX `projects__org_id__idx` ON `projects` (`org_id`);
CREATE INDEX `steps__test_id__idx` ON `steps` (`test_id`);
CREATE INDEX `steps__test_id__idx` ON `steps_runs` (`test_id`);
CREATE INDEX `suites__project_id__idx` ON `suites` (`project_id`);
CREATE INDEX `runs__suite_id__idx` ON `suites_runs` (`suite_id`);
CREATE INDEX `tests__suite_id__idx` ON `tests` (`suite_id`);
CREATE INDEX `tests__suite_id__idx` ON `test_runs` (`suite_id`);
CREATE INDEX `tests__suite_run_id__idx` ON `test_runs` (`suite_run_id`);