CREATE TABLE IF NOT EXISTS "graphite_comments" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"suite_run_id" varchar(191),
	"test_run_id" varchar(191),
	"user_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_cronjobs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"suite_id" varchar(191) NOT NULL,
	"cron" varchar(191) NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_organization_invites_requests" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"domain" varchar(191) NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "graphite_organization_invites_requests_domain_unique" UNIQUE("domain")
);

CREATE TABLE IF NOT EXISTS "graphite_organizations" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"description" text NOT NULL,
	"logo" text NOT NULL,
	"domain" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "graphite_organizations_domain_unique" UNIQUE("domain")
);

CREATE TABLE IF NOT EXISTS "graphite_projects" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"org_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_steps" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"test_id" varchar(191) NOT NULL,
	"step_number" integer NOT NULL,
	"selector" text,
	"action" varchar NOT NULL,
	"click" varchar NOT NULL,
	"assign" text,
	"keypress" varchar NOT NULL,
	"go_to_url" text,
	"pause" integer,
	"is_optional" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_steps_runs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"step_id" varchar(191) NOT NULL,
	"test_id" varchar(191) NOT NULL,
	"test_run_id" varchar(191) NOT NULL,
	"step_number" integer NOT NULL,
	"selector" text,
	"action" varchar NOT NULL,
	"click" varchar NOT NULL,
	"assign" text,
	"keypress" varchar NOT NULL,
	"go_to_url" text,
	"pause" integer,
	"status" varchar NOT NULL,
	"is_optional" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_suites" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"project_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_suites_runs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"suite_id" varchar(191) NOT NULL,
	"triggered_by" varchar(191) NOT NULL,
	"duration" integer NOT NULL,
	"status" varchar NOT NULL,
	"start_url" text NOT NULL,
	"end_url" text NOT NULL,
	"video_url" text NOT NULL,
	"user_agent" text NOT NULL,
	"view_port" text NOT NULL,
	"tests_passed" integer NOT NULL,
	"tests_failed" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_tests" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"suite_id" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_test_runs" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"test_id" varchar(191) NOT NULL,
	"suite_id" varchar(191) NOT NULL,
	"suite_run_id" varchar(191) NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_users" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"avatar" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "graphite_users_to_organizations" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"org_id" varchar(191) NOT NULL,
	"status" varchar NOT NULL,
	"role" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "comments__run_id__idx" ON "graphite_comments" ("suite_run_id");
CREATE INDEX IF NOT EXISTS "comments__test_id__idx" ON "graphite_comments" ("test_run_id");
CREATE INDEX IF NOT EXISTS "cronjobs__suite_id__idx" ON "graphite_cronjobs" ("suite_id");
CREATE UNIQUE INDEX IF NOT EXISTS "invites__domain__idx" ON "graphite_organization_invites_requests" ("domain");
CREATE UNIQUE INDEX IF NOT EXISTS "organizations__domain__idx" ON "graphite_organizations" ("domain");
CREATE INDEX IF NOT EXISTS "projects__org_id__idx" ON "graphite_projects" ("org_id");
CREATE INDEX IF NOT EXISTS "steps__test_id__idx" ON "graphite_steps" ("test_id");
CREATE INDEX IF NOT EXISTS "steps_runs__test_id__idx" ON "graphite_steps_runs" ("test_id");
CREATE UNIQUE INDEX IF NOT EXISTS "steps_runs__test_run_id__step_id" ON "graphite_steps_runs" ("test_run_id","step_id");
CREATE INDEX IF NOT EXISTS "suites__project_id__idx" ON "graphite_suites" ("project_id");
CREATE INDEX IF NOT EXISTS "runs__suite_id__idx" ON "graphite_suites_runs" ("suite_id");
CREATE INDEX IF NOT EXISTS "tests__suite_id__idx" ON "graphite_tests" ("suite_id");
CREATE INDEX IF NOT EXISTS "tests_runs__suite_id__idx" ON "graphite_test_runs" ("suite_id");
CREATE INDEX IF NOT EXISTS "tests_runs__suite_run_id__idx" ON "graphite_test_runs" ("suite_run_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_to_organizations__user_id__org_id__idx" ON "graphite_users_to_organizations" ("user_id","org_id");