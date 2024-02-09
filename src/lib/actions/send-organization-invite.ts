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

async function isUserAdmin(id: string) {
  const userToOrg = await db
  .select({ role: usersToOrganizations.role })
  .from(usersToOrganizations)
  .where(eq(usersToOrganizations.userId, id))
  .limit(1);

  return userToOrg.length > 0 && ['Admin', 'Owner'].includes(userToOrg[0]?.role || '');
}
export async function sendOrganizationRequest(formData: FormData) {
  'use server';
  const organizationDomain = formData.get('organizationDomain') as string;
  const organizationName = formData.get('organizationName') as string;
  const userId = formData.get('userId') as string;
  const userEmail = formData.get('userEmail') as string;
  const { user, isAuthenticated } = await getUser();
  if (!isAuthenticated || !user) {
    const authUrl = getAuthorizationUrl();
    return redirect(authUrl);
  } else if (notAllowedOrganizationDomains.includes(organizationDomain)) {
    return redirect('/organization/search/confirm?error=invalid-domain');
  }
  if (!(await isUserAdmin(user.id))) {
    return redirect('/organization/search/confirm?error=unauthorized');
  };
  const organizationsStored = await db
    .select({
      domain: organizations.domain,
      id: organizations.id,
    })
    .from(organizations)
    .where(eq(organizations.domain, organizationDomain));
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
        eq(usersToOrganizations.userId, userId),
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
        eq(organizationInvites.userId, userId),
        or(
          eq(organizationInvites.status, 'Pending'),
          eq(organizationInvites.status, 'Approved'),
        ),
      ),
    );
  if (organizationsInvitesStored.length) {
    return redirect(
      `/organization/search/confirm?error=invitation-already-sent&organizationDomain=${organizationDomain}`,
    );
  }
  await db.insert(organizationInvites).values({
    id: ulid(),
    userId: userId,
    domain: organizationDomain || '',
    type: 'Request',
    status: 'Pending',
  });
  // TODO: Send email to user
  return redirect(
    `/organization/search/confirm?organizationDomain=${organizationDomain}`,
  );
}
