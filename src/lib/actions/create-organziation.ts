import { getAuthorizationUrl, getUser } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import { organizations, usersToOrganizations } from '@/lib/db/schema';
import { notAllowedOrganizationDomains } from '@/lib/not-allowed-orgs';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import crypto from 'node:crypto';

export async function createOrganization(formData: FormData) {
  'use server';
  const organizationDomain = formData.get('organizationDomain') as string;
  const organizationName = formData.get('organizationName') as string;
  const organizationDescription = formData.get(
    'organizationDescription',
  ) as string;

  const { user, isAuthenticated } = await getUser();
  if (!isAuthenticated || !user) {
    const authUrl = getAuthorizationUrl();
    return redirect(authUrl);
  } else if (notAllowedOrganizationDomains.includes(organizationDomain)) {
    return redirect('/organization/create/confirm?error=invalid-domain');
  }
  const id = crypto.randomUUID();
  const organizationsStored = await db
    .select({
      domain: organizations.domain,
    })
    .from(organizations)
    .where(eq(organizations.domain, organizationDomain));
  if (organizationsStored.length) {
    return redirect(
      `/organization/create/confirm?error=already-exists&organizationDomain=${organizationDomain}`,
    );
  }
  await db.insert(organizations).values({
    id,
    name: organizationName,
    description: organizationDescription,
    domain: organizationDomain,
    logo: '',
  });

  await db.insert(usersToOrganizations).values({
    id: crypto.randomUUID(),
    userId: user.id,
    status: 'Active',
    role: 'Owner',
    orgId: id,
  });

  return redirect(
    `/organization/create/confirm?organizationDomain=${organizationDomain}`,
  );
}
