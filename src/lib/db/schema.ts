import {
	datetime,
	index,
	int,
	boolean,
	mysqlTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
	mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
	"users",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }),
		email: varchar("email", { length: 191 }).notNull(),
		emailVerified: timestamp("email_verified"),
		image: varchar("image", { length: 191 }),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(user) => ({
		emailIndex: uniqueIndex("users__email__idx").on(user.email),
	})
);

export const accounts = mysqlTable(
	"accounts",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		userId: varchar("user_id", { length: 191 }),
		type: varchar("type", { length: 191 }).notNull(),
		provider: varchar("provider", { length: 191 }).notNull(),
		providerAccountId: varchar("provider_account_id", {
			length: 191,
		}).notNull(),
		access_token: text("access_token"),
		expiresIn: int("expires_in"),
		idToken: text("id_token"),
		refreshToken: text("refresh_token"),
		refreshTokenExpiresIn: int("refresh_token_expires_in"),
		scope: varchar("scope", { length: 191 }),
		tokenType: varchar("token_type", { length: 191 }),
		createdAt: timestamp("created_at").defaultNow().onUpdateNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	(account) => ({
		providerProviderAccountIdIndex: uniqueIndex(
			"accounts__provider__providerAccountId__idx"
		).on(account.provider, account.providerAccountId),
		userIdIndex: index("accounts__user_id__idx").on(account.userId),
	})
);

export const sessions = mysqlTable(
	"sessions",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		sessionToken: varchar("session_token", { length: 191 }).notNull(),
		userId: varchar("user_id", { length: 191 }),
		expires: datetime("expires").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(session) => ({
		sessionTokenIndex: uniqueIndex("sessions__session_token__idx").on(
			session.sessionToken
		),
		userIdIndex: index("sessions__userId__idx").on(session.userId),
	})
);

export const verificationTokens = mysqlTable(
	"verification_tokens",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		token: varchar("token", { length: 191 }).notNull(),
		expires: datetime("expires").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(verificationToken) => ({
		tokenIndex: uniqueIndex("verification_tokens__token__idx").on(
			verificationToken.token
		),
	})
);

export const organizations = mysqlTable("organizations", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const usersToOrganizations = mysqlTable(
	"users_to_organizations",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		userId: varchar("user_id", { length: 191 }).notNull(),
		orgId: varchar("org_id", { length: 191 }).notNull(),
	},
	(usersToOrganizations) => ({
		usersToOrganizationsIndex: uniqueIndex(
			"users_to_organizations__user_id__org_id__idx"
		).on(usersToOrganizations.userId, usersToOrganizations.orgId),
	})
);

export const projects = mysqlTable(
	"projects",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		orgId: varchar("org_id", { length: 191 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},

	(projects) => ({
		orgdIndex: index("projects__org_id__idx").on(projects.orgId),
	})
);

export const suites = mysqlTable(
	"suites",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		projectId: varchar("project_id", { length: 191 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(suites) => ({
		projectIdIndex: index("suites__project_id__idx").on(suites.projectId),
	})
);

export const tests = mysqlTable(
	"tests",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		suiteId: varchar("suite_id", { length: 191 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(tests) => ({
		suiteIdIndex: index("tests__suite_id__idx").on(tests.suiteId),
	})
);

const actions = [
	"Click",
	"MouseHover",
	"Assign",
	"Keypress",
	"Pause",
	"Exit",
	"GoToURL",
	"GoBack",
	"Refresh",
] as const;

export const steps = mysqlTable(
	"steps",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		testId: varchar("test_id", { length: 191 }).notNull(),
		stepNumber: int("step_number").notNull(),
		selector: text("selector"),
		action: mysqlEnum("action", actions).notNull(),
		click: mysqlEnum("click", ["Left", "Middle", "Right", "Double Left"]),
		assign: text("assign"),
		keypress: mysqlEnum("keypress", ["Enter", "Tab", "Escape", "Space"]),
		goToUrl: text("go_to_url"),
		pause: int("pause"),
		isOptional: boolean("is_optional").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(steps) => ({
		testIdIndex: index("steps__test_id__idx").on(steps.testId),
	})
);

export const stepsRuns = mysqlTable(
	"steps_runs",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		stepId: varchar("step_id", { length: 191 }).notNull(),
		testId: varchar("test_id", { length: 191 }).notNull(),
		testRunId: varchar("test_run_id", { length: 191 }).notNull(),
		stepNumber: int("step_number").notNull(),
		selector: text("selector"),
		action: mysqlEnum("action", actions).notNull(),
		click: mysqlEnum("click", ["Left", "Middle", "Right", "Double Left"]),
		assign: text("assign"),
		keypress: mysqlEnum("keypress", ["Enter", "Tab", "Escape", "Space"]),
		goToUrl: text("go_to_url"),
		pause: int("pause"),
		status: mysqlEnum("status", ["Passed", "Failed", "Unknown"]).notNull(),
		isOptional: boolean("is_optional").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(steps) => ({
		testIdIndex: index("steps__test_id__idx").on(steps.testId),
		testRunIdIndex: uniqueIndex("steps_runs__test_run_id__step_id").on(steps.testRunId, steps.stepId),
	})
);

export const testsRuns = mysqlTable(
	"test_runs",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		testId: varchar("test_id", { length: 191 }).notNull(),
		suiteId: varchar("suite_id", { length: 191 }).notNull(),
		suiteRunId: varchar("suite_run_id", { length: 191 }).notNull(),
		status: mysqlEnum("status", ["Passed", "Failed", "Unknown"]).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(tests) => ({
		suiteIdIndex: index("tests__suite_id__idx").on(tests.suiteId),
		suiteRunId: index("tests__suite_run_id__idx").on(tests.suiteRunId),
	})
);

export const suitesRuns = mysqlTable(
	"suites_runs",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		suiteId: varchar("suite_id", { length: 191 }).notNull(),
		triggeredBy: varchar("triggered_by", { length: 191 }).notNull(),
		duration: int("duration").notNull(),
		status: mysqlEnum("status", [
			"running",
			"passed",
			"failed",
			"aborted",
		]).notNull(),
		startURL: text("start_url").notNull(),
		endURL: text("end_url").notNull(),
		videoURL: text("video_url").notNull(),
		userAgent: text("user_agent").notNull(),
		viewPort: text("view_port").notNull(),
		testsPassed: int("tests_passed").notNull(),
		testsFailed: int("tests_failed").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		completedAt: timestamp("completed_at").notNull().defaultNow().onUpdateNow(),
	},
	(runs) => ({
		suiteIndex: index("runs__suite_id__idx").on(runs.suiteId),
	})
);
export const cronjobs = mysqlTable(
	"cronjobs",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		suiteId: varchar("suite_id", { length: 191 }).notNull(),
		cron: varchar("cron", { length: 191 }).notNull(),
		enabled: boolean("enabled").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(crobjobs) => ({
		suiteIndex: index("cronjobs__suite_id__idx").on(crobjobs.suiteId),
	})
);

export const comments = mysqlTable(
	"comments",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		suiteRunId: varchar("suite_run_id", { length: 191 }),
		testRunId: varchar("test_run_id", { length: 191 }),
		userId: varchar("user_id", { length: 191 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
		updateAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
	},
	(comments) => ({
		runIndex: index("comments__run_id__idx").on(comments.suiteRunId),
		testIndex: index("comments__test_id__idx").on(comments.testRunId),
	})
);
