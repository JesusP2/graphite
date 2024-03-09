import {
  timestamp,
  varchar,
  integer,
  index,
  text,
  boolean,
  uniqueIndex,
  pgEnum
} from 'drizzle-orm/pg-core';
import { pgTableCreator } from 'drizzle-orm/pg-core';

const pgTable = pgTableCreator((name) => `graphite_${name}`)

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
);

export const organizations = pgTable(
  'organizations',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    description: text('description').notNull(),
    logo: text('logo').notNull(),
    domain: varchar('domain', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (organizations) => ({
    domainIndex: uniqueIndex('organizations__domain__idx').on(
      organizations.domain,
    ),
  }),
);

export const usersToOrganizations = pgTable(
  'users_to_organizations',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    userId: varchar('user_id', { length: 191 }).notNull(),
    orgId: varchar('org_id', { length: 191 }).notNull(),
    status: pgEnum('varchar', [
      'Blocked', 'Active', 'Disabled'
    ])('status').notNull(),
    role: pgEnum('varchar', [
      'Admin', 'Owner', 'Member'
    ])('role').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (usersToOrganizations) => ({
    usersToOrganizationsIndex: uniqueIndex(
      'users_to_organizations__user_id__org_id__idx',
    ).on(usersToOrganizations.userId, usersToOrganizations.orgId),
  }),
);

export const organizationInvites = pgTable(
  'organization_invites_requests',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    userId: varchar('user_id', { length: 191 }).notNull(),
    domain: varchar('domain', { length: 191 }).notNull().unique(),
    type: pgEnum('varchar', [
      'Invite', 'Request'
    ])('type').notNull(),
    status: pgEnum('varchar', [
      'Pending', 'Approved', 'Rejected'
    ])('status').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (organizationInvites) => ({
    organizationIndex: uniqueIndex('invites__domain__idx').on(
      organizationInvites.domain,
    ),
  }),
);

export const projects = pgTable(
  'projects',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    orgId: varchar('org_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },

  (projects) => ({
    orgdIndex: index('projects__org_id__idx').on(projects.orgId),
  }),
);

export const suites = pgTable(
  'suites',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    projectId: varchar('project_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (suites) => ({
    projectIdIndex: index('suites__project_id__idx').on(suites.projectId),
  }),
);

export const tests = pgTable(
  'tests',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
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

export const steps = pgTable(
  'steps',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    testId: varchar('test_id', { length: 191 }).notNull(),
    stepNumber: integer('step_number').notNull(),
    selector: text('selector'),
    action: pgEnum('varchar', actions)('action').notNull(),
    click: pgEnum('varchar',['Left', 'Middle', 'Right', 'Double Left'])('click').notNull(),
    assign: text('assign'),
    keypress: pgEnum('varchar', [
      'Enter', 'Tab', 'Escape', 'Space'
    ])('keypress').notNull(),
    goToUrl: text('go_to_url'),
    pause: integer('pause'),
    isOptional: boolean('is_optional').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (steps) => ({
    testIdIndex: index('steps__test_id__idx').on(steps.testId),
  }),
);

export const stepsRuns = pgTable(
  'steps_runs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    stepId: varchar('step_id', { length: 191 }).notNull(),
    testId: varchar('test_id', { length: 191 }).notNull(),
    testRunId: varchar('test_run_id', { length: 191 }).notNull(),
    stepNumber: integer('step_number').notNull(),
    selector: text('selector'),
    action: pgEnum('varchar', actions)('action').notNull(),
    click: pgEnum('varchar',['Left', 'Middle', 'Right', 'Double Left'])('click').notNull(),
    assign: text('assign'),
    keypress: pgEnum('varchar', [
      'Enter', 'Tab', 'Escape', 'Space'
    ])('keypress').notNull(),
    goToUrl: text('go_to_url'),
    pause: integer('pause'),
    status: pgEnum('varchar',['Passed', 'Failed', 'Unknown'])('status').notNull(),
    isOptional: boolean('is_optional').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (steps) => ({
    testIdIndex: index('steps_runs__test_id__idx').on(steps.testId),
    testRunIdIndex: uniqueIndex('steps_runs__test_run_id__step_id').on(
      steps.testRunId,
      steps.stepId,
    ),
  }),
);

export const testsRuns = pgTable(
  'test_runs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    testId: varchar('test_id', { length: 191 }).notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    suiteRunId: varchar('suite_run_id', { length: 191 }).notNull(),
    status: pgEnum('varchar',['Passed', 'Failed', 'Unknown'])('status').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (tests) => ({
    suiteIdIndex: index('tests_runs__suite_id__idx').on(tests.suiteId),
    suiteRunId: index('tests_runs__suite_run_id__idx').on(tests.suiteRunId),
  }),
);

export const suitesRuns = pgTable(
  'suites_runs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    triggeredBy: varchar('triggered_by', { length: 191 }).notNull(),
    duration: integer('duration').notNull(),
    status: pgEnum('varchar',['running', 'passed', 'failed', 'aborted'])('status').notNull(),
    startURL: text('start_url').notNull(),
    endURL: text('end_url').notNull(),
    videoURL: text('video_url').notNull(),
    userAgent: text('user_agent').notNull(),
    viewPort: text('view_port').notNull(),
    testsPassed: integer('tests_passed').notNull(),
    testsFailed: integer('tests_failed').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    completedAt: timestamp('completed_at').defaultNow(),
  },
  (runs) => ({
    suiteIndex: index('runs__suite_id__idx').on(runs.suiteId),
  }),
);
export const cronjobs = pgTable(
  'cronjobs',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    suiteId: varchar('suite_id', { length: 191 }).notNull(),
    cron: varchar('cron', { length: 191 }).notNull(),
    enabled: boolean('enabled').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (crobjobs) => ({
    suiteIndex: index('cronjobs__suite_id__idx').on(crobjobs.suiteId),
  }),
);

export const comments = pgTable(
  'comments',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    suiteRunId: varchar('suite_run_id', { length: 191 }),
    testRunId: varchar('test_run_id', { length: 191 }),
    userId: varchar('user_id', { length: 191 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (comments) => ({
    runIndex: index('comments__run_id__idx').on(comments.suiteRunId),
    testIndex: index('comments__test_id__idx').on(comments.testRunId),
  }),
);
