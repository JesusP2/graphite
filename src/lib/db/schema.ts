import {
  index,
  int,
  boolean,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
);

export const organizations = mysqlTable(
  'organizations',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    description: text('description').notNull(),
    logo: text('logo').notNull(),
    domain: varchar('domain', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (organizations) => ({
    domainIndex: uniqueIndex('organizations__domain__idx').on(
      organizations.domain,
    ),
  }),
);

export const usersToOrganizations = mysqlTable(
  'users_to_organizations',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    userId: varchar('user_id', { length: 191 }).notNull(),
    orgId: varchar('org_id', { length: 191 }).notNull(),
    status: mysqlEnum('status', ['Blocked', 'Active', 'Disabled']).notNull(),
    role: mysqlEnum('role', ['Admin', 'Owner', 'Member']).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (usersToOrganizations) => ({
    usersToOrganizationsIndex: uniqueIndex(
      'users_to_organizations__user_id__org_id__idx',
    ).on(usersToOrganizations.userId, usersToOrganizations.orgId),
  }),
);

export const organizationInvites = mysqlTable(
  'organization_invites_requests',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    userId: varchar('user_id', { length: 191 }).notNull(),
    domain: varchar('domain', { length: 191 }).notNull().unique(),
    type: mysqlEnum('type', ['Invite', 'Request']).notNull(),
    status: mysqlEnum('status', ['Pending', 'Approved', 'Rejected']).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (organizationInvites) => ({
    organizationIndex: uniqueIndex('invites__domain__idx').on(
      organizationInvites.domain,
    ),
  }),
);

export const projects = mysqlTable(
  'projects',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    orgId: varchar('org_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },

  (projects) => ({
    orgdIndex: index('projects__org_id__idx').on(projects.orgId),
  }),
);

export const suites = mysqlTable(
  'suites',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    projectId: varchar('project_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (suites) => ({
    projectIdIndex: index('suites__project_id__idx').on(suites.projectId),
  }),
);

export const tests = mysqlTable(
  'tests',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (tests) => ({
    suiteIdIndex: index('tests__suite_id__idx').on(tests.suiteId),
  }),
);

const actions = [
  'Click',
  'MouseHover',
  'Assign',
  'Keypress',
  'Pause',
  'Exit',
  'GoToURL',
  'GoBack',
  'Refresh',
] as const;

export const steps = mysqlTable(
  'steps',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    testId: varchar('test_id', { length: 191 }).notNull(),
    stepNumber: int('step_number').notNull(),
    selector: text('selector'),
    action: mysqlEnum('action', actions).notNull(),
    click: mysqlEnum('click', ['Left', 'Middle', 'Right', 'Double Left']),
    assign: text('assign'),
    keypress: mysqlEnum('keypress', ['Enter', 'Tab', 'Escape', 'Space']),
    goToUrl: text('go_to_url'),
    pause: int('pause'),
    isOptional: boolean('is_optional').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (steps) => ({
    testIdIndex: index('steps__test_id__idx').on(steps.testId),
  }),
);

export const stepsRuns = mysqlTable(
  'steps_runs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    stepId: varchar('step_id', { length: 191 }).notNull(),
    testId: varchar('test_id', { length: 191 }).notNull(),
    testRunId: varchar('test_run_id', { length: 191 }).notNull(),
    stepNumber: int('step_number').notNull(),
    selector: text('selector'),
    action: mysqlEnum('action', actions).notNull(),
    click: mysqlEnum('click', ['Left', 'Middle', 'Right', 'Double Left']),
    assign: text('assign'),
    keypress: mysqlEnum('keypress', ['Enter', 'Tab', 'Escape', 'Space']),
    goToUrl: text('go_to_url'),
    pause: int('pause'),
    status: mysqlEnum('status', ['Passed', 'Failed', 'Unknown']).notNull(),
    isOptional: boolean('is_optional').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (steps) => ({
    testIdIndex: index('steps__test_id__idx').on(steps.testId),
    testRunIdIndex: uniqueIndex('steps_runs__test_run_id__step_id').on(
      steps.testRunId,
      steps.stepId,
    ),
  }),
);

export const testsRuns = mysqlTable(
  'test_runs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    testId: varchar('test_id', { length: 191 }).notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    suiteRunId: varchar('suite_run_id', { length: 191 }).notNull(),
    status: mysqlEnum('status', ['Passed', 'Failed', 'Unknown']).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (tests) => ({
    suiteIdIndex: index('tests__suite_id__idx').on(tests.suiteId),
    suiteRunId: index('tests__suite_run_id__idx').on(tests.suiteRunId),
  }),
);

export const suitesRuns = mysqlTable(
  'suites_runs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    triggeredBy: varchar('triggered_by', { length: 191 }).notNull(),
    duration: int('duration').notNull(),
    status: mysqlEnum('status', [
      'running',
      'passed',
      'failed',
      'aborted',
    ]).notNull(),
    startURL: text('start_url').notNull(),
    endURL: text('end_url').notNull(),
    videoURL: text('video_url').notNull(),
    userAgent: text('user_agent').notNull(),
    viewPort: text('view_port').notNull(),
    testsPassed: int('tests_passed').notNull(),
    testsFailed: int('tests_failed').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    completedAt: timestamp('completed_at').notNull().defaultNow().onUpdateNow(),
  },
  (runs) => ({
    suiteIndex: index('runs__suite_id__idx').on(runs.suiteId),
  }),
);
export const cronjobs = mysqlTable(
  'cronjobs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    cron: varchar('cron', { length: 191 }).notNull(),
    enabled: boolean('enabled').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (crobjobs) => ({
    suiteIndex: index('cronjobs__suite_id__idx').on(crobjobs.suiteId),
  }),
);

export const comments = mysqlTable(
  'comments',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    suiteRunId: varchar('suite_run_id', { length: 191 }),
    testRunId: varchar('test_run_id', { length: 191 }),
    userId: varchar('user_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
    updateAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (comments) => ({
    runIndex: index('comments__run_id__idx').on(comments.suiteRunId),
    testIndex: index('comments__test_id__idx').on(comments.testRunId),
  }),
);
