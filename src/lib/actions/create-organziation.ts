'use server';
import { getAuthorizationUrl, getUser } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import { organizations, usersToOrganizations } from '@/lib/db/schema';
import { notAllowedOrganizationDomains, organizationDomainValidCharactersRegex } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ulid } from 'ulid';
import {
  Input,
  custom,
  maxLength,
  minLength,
  object,
  safeParse,
  string,
  toLowerCase,
} from 'valibot';

export const createInitialState = () => ({
  organizationName: {
    value: '',
    error: null as string | null,
  },
  organizationDomain: {
    value: '',
    error: null as string | null,
  },
  organizationDescription: {
    value: '',
    error: null as string | null,
  },
});

const schema = object({
  organizationName: string("Organization name can't be empty", [
    minLength(5, 'Organization name must be at least 5 characters long'),
    maxLength(50, 'Organization name must be at most 50 characters long'),
  ]),
  organizationDomain: string("Organization domain can't be empty", [
    toLowerCase(),
    minLength(10, 'Organization domain must be at least 10 characters long'),
    maxLength(30, 'Organization domain must be at most 30 characters long'),
    custom(
      (value) =>
          !organizationDomainValidCharactersRegex.test(value) ||
          notAllowedOrganizationDomains.includes(value)
        ,
      'Invalid domain',
    ),
  ]),
  organizationDescription: string("Organization description can't be empty", [
    minLength(
      5,
      'Organization description must be at least 10 characters long',
    ),
    maxLength(
      50,
      'Organization description must be at most 50 characters long',
    ),
  ]),
});
export async function createOrganization(
  values: {
    [K in keyof Input<typeof schema>]: { value: string; error: string | null };
  },
  formData: FormData,
) {
  const { output, success, issues } = safeParse(schema, {
    organizationDomain: formData.get('organizationDomain'),
    organizationName: formData.get('organizationName'),
    organizationDescription: formData.get('organizationDescription'),
  });
  if (!success) {
    const newValue: any = createInitialState();
    issues.forEach((issue) => {
      const path = issue.path?.[0];
      if (!path) return;
      const { key, value } = path;
      newValue[key as keyof typeof newValue] = {
        value,
        error: issue.message,
      };
    });
    return newValue;
  }
  const { organizationDomain, organizationName, organizationDescription } =
    output;

  const newValue = createInitialState();
  newValue.organizationDomain.value = organizationDomain;
  newValue.organizationName.value = organizationName;
  newValue.organizationDescription.value = organizationDescription;

  const { user, isAuthenticated } = await getUser();
  if (!isAuthenticated || !user) {
    const authUrl = getAuthorizationUrl();
    return redirect(authUrl);
  }
  const id = ulid();
  const organizationsStored = await db
    .select({
      domain: organizations.domain,
    })
    .from(organizations)
    .where(eq(organizations.domain, organizationDomain));
  if (organizationsStored.length) {
    newValue.organizationDomain.error = 'Already exists';
    return newValue;
  }
  await db.insert(organizations).values({
    id,
    name: organizationName,
    description: organizationDescription,
    domain: organizationDomain,
    logo: '',
  });

  await db.insert(usersToOrganizations).values({
    id: ulid(),
    userId: user.id,
    status: 'Active',
    role: 'Owner',
    orgId: id,
  });

  redirect(`/organization/${organizationDomain}/overview`);
}
