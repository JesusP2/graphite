import { getAuthorizationUrl, getUser } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import { organizationInvites, organizations } from '@/lib/db/schema';
import { notAllowedOrganizationDomains } from '@/lib/not-allowed-orgs';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import crypto from 'node:crypto';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const organizationDomain = formData.get('organizationDomain') as string;
  const { user, isAuthenticated } = await getUser();
  if (!isAuthenticated || !user) {
    const authUrl = getAuthorizationUrl();
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  } else if (notAllowedOrganizationDomains.includes(organizationDomain)) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/organization/search/confirm?error=invalid-domain',
      },
    });
  }
  try {
    const organizationsStored = await db
      .select({
        domain: organizations.domain,
      })
      .from(organizations)
      .where(eq(organizations.domain, organizationDomain));
    if (organizationsStored.length) {
      const organizationsInvitesStored = await db
        .select({
          domain: organizations.domain,
        })
        .from(organizationInvites)
        .where(
          and(
            eq(organizationInvites.domain, organizationDomain),
            eq(organizationInvites.userId, user.id),
          ),
        );
      if (organizationsInvitesStored.length) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `/organization/search/confirm?error=already-requested&organizationDomain=${organizationDomain}`,
          },
        });
      } else {
        await db.insert(organizationInvites).values({
          id: crypto.randomUUID(),
          userId: user.id,
          domain: organizationDomain || '',
          type: 'Request',
          status: 'Pending',
        });
      }
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/organization/search/confirm?organizationDomain=${organizationDomain}`,
      },
    });
  } catch (error) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/organization/search/confirm?error=unknown-error&organizationDomain=${organizationDomain}`,
      },
    });
  }
}
