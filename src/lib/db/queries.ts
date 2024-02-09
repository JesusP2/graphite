import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { organizations, users, usersToOrganizations } from '../db/schema';

export type UserOrganization = {
  id: string;
  orgId: string | null;
  name: string | null;
  domain: string | null;
  logo: string | null;
  description: string | null;
};

export async function getUserOrganizations(userId: string): Promise<UserOrganization[]> {
  return db
    .select({
      id: users.id,
      orgId: usersToOrganizations.orgId,
      name: organizations.name,
      domain: organizations.domain,
      logo: organizations.logo,
      description: organizations.description,
    })
    .from(users)
    .where(eq(users.id, userId))
    .leftJoin(usersToOrganizations, eq(usersToOrganizations.userId, userId))
    .leftJoin(organizations, eq(organizations.id, usersToOrganizations.orgId));
}
