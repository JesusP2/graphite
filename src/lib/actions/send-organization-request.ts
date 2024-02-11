'use server';
import { getAuthorizationUrl, getUser } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import {
  organizationInvites,
  organizations,
  usersToOrganizations,
} from '@/lib/db/schema';
import { notAllowedOrganizationDomains, organizationDomainValidCharactersRegex } from '@/lib/utils';
import { and, eq, or } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ulid } from 'ulid';
import { Input, custom, maxLength, minLength, object, safeParse, string, toLowerCase } from 'valibot';

export const createInitialState = () => ({
  organizationDomain: {
    value: '',
    error: null as string | null,
  },
})

const schema = object({
  organizationDomain: string("Organization domain can't be empty", [
    toLowerCase(),
    minLength(10, 'Organization domain must be at least 10 characters long'),
    maxLength(30, 'Organization domain must be at most 30 characters long'),
    custom(
      (value) =>
          organizationDomainValidCharactersRegex.test(value) ||
          !notAllowedOrganizationDomains.includes(value)
        ,
      'Invalid domain',
    ),
  ]),
})

export async function sendOrganizationRequest(
  values: {
    [K in keyof Input<typeof schema>]: { value: string; error: string | null };
  },
  formData: FormData
) {
  console.log('idk:', organizationDomainValidCharactersRegex.test(formData.get('organizationDomain') as string))
  console.log('idk:', notAllowedOrganizationDomains.includes(formData.get('organizationDomain') as string))
  const { output, success, issues } = safeParse(schema, {
    organizationDomain: formData.get('organizationDomain') as string,
  })
  if (!success) {
    console.log(issues)
    const newValue: any = createInitialState();
    issues.forEach((issue) => {
      const path = issue.path?.[0];
      if (!path) return;
      const { key, value } = path;
      newValue.organizationDomain.value = value;
      newValue.organizationDomain.error = issue.message;
    });
    return newValue;
  }
  const { organizationDomain } = output
  const newValue = createInitialState();
  newValue.organizationDomain.value = organizationDomain;

  const { user, isAuthenticated } = await getUser();
  if (!isAuthenticated || !user) {
    const authUrl = getAuthorizationUrl();
    return redirect(authUrl);
  }
  const organizationsStored = await db
    .select({
      domain: organizations.domain,
      id: organizations.id,
    })
    .from(organizations)
    .where(eq(organizations.domain, organizationDomain))
    .limit(1);
  if (!organizationsStored.length) {
    newValue.organizationDomain.error = 'Already exists';
    return newValue;
  }

  const usersToOrganizationsStored = await db
    .select()
    .from(usersToOrganizations)
    .where(
      and(
        eq(usersToOrganizations.userId, user.id),
        eq(usersToOrganizations.orgId, organizationsStored[0]?.id || ''),
      ),
    );
  if (usersToOrganizationsStored.length) {
    newValue.organizationDomain.error = 'Already member';
    return newValue;
  }

  const organizationsInvitesStored = await db
    .select({
      domain: organizations.domain,
    })
    .from(organizationInvites)
    .where(
      and(
        eq(organizationInvites.domain, organizationDomain),
        eq(organizationInvites.userId, user.id),
        or(
          eq(organizationInvites.status, 'Pending'),
          eq(organizationInvites.status, 'Approved'),
        ),
      ),
    );
  if (organizationsInvitesStored.length) {
    newValue.organizationDomain.error = 'Already requested';
    return newValue;
  }
  await db.insert(organizationInvites).values({
    id: ulid(),
    userId: user.id,
    domain: organizationDomain || '',
    type: 'Request',
    status: 'Pending',
  });
  return redirect(
    `/organization/search/confirm?organizationDomain=${organizationDomain}`,
  );
}

// user-org status
// - does not exist relation // can send requests
// - blocked  // cant send requests
// - active   // cant send requests
// - disabled // cant send requests
//
// request status
// - requested
// - - does not exist // can send requests
// - - pending // cant send requests
// - - approved // cant send requests
// - - rejected // can send requests
// - invited
// - - does not exist // can send requests
// - - pending // cant send requests
// - - approved // cant send requests
// - - rejected // can send requests // user should not be able to reject invitations
