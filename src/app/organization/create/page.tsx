import { getAuthorizationUrl, getUser } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import {
  organizationInvites,
  organizations,
  usersToOrganizations,
} from '@/lib/db/schema';
import { notAllowedOrganizationDomains } from '@/lib/not-allowed-orgs';
import { redirect } from 'next/navigation';
import crypto from 'node:crypto';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { interFont } from '@/lib/fonts';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { ConfirmRequest } from '@/components/confirm-search';

async function createOrganization(formData: FormData) {
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
  try {
    const id = crypto.randomUUID();
    const org = await db.insert(organizations).values({
      id,
      name: organizationName,
      description: organizationDescription,
      domain: organizationDomain,
      logo: '',
    });

    await db.insert(usersToOrganizations).values({
      id: crypto.randomUUID(),
      userId: user.id,
      orgId: id,
    });

    return redirect(
      `/organization/create/confirm?organizationDomain=${organizationDomain}`,
    );
  } catch (error) {
    return redirect(
      `/organization/create/confirm?error=already-exists&organizationDomain=${organizationDomain}`,
    );
  }
}

export default function Page() {
  return (
    <main className="max-w-lg mx-auto w-full my-10">
      <h1 className={cn('text-xl font-bold', interFont.className)}>
        Create organization
      </h1>
      <form
        action={createOrganization}
        method="POST"
        name="search-org"
        id="search-org"
      >
        <div className="max-w-lg w-full my-4 flex flex-col gap-y-2">
          <Input name="organizationName" placeholder="Name" />
          <Input name="organizationDomain" placeholder="Domain" />
          <Input
            name="organizationDescription"
            placeholder="Short description"
          />
        </div>
        <ConfirmRequest />
      </form>
    </main>
  );
}
