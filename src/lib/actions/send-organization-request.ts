import { getAuthorizationUrl, getUser } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import {
  organizationInvites,
  organizations,
  usersToOrganizations,
} from '@/lib/db/schema';
import { notAllowedOrganizationDomains } from '@/lib/not-allowed-orgs';
import { and, eq, or } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ulid } from 'ulid';

export async function sendOrganizationRequest(formData: FormData) {
  'use server';
  const organizationDomain = formData.get('organizationDomain') as string;
  const { user, isAuthenticated } = await getUser();
  if (!isAuthenticated || !user) {
    const authUrl = getAuthorizationUrl();
    return redirect(authUrl);
  } else if (notAllowedOrganizationDomains.includes(organizationDomain)) {
    return redirect('/organization/search/confirm?error=invalid-domain');
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
    return redirect(
      `/organization/search/confirm?error=not-found&organizationDomain=${organizationDomain}`,
    );
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
    return redirect(
      `/organization/search/confirm?error=unauthorized&organizationDomain=${organizationDomain}`,
    );
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
    return redirect(
      `/organization/search/confirm?error=already-requested&organizationDomain=${organizationDomain}`,
    );
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
