import { db } from '../db/connection';
import { users } from '../db/schema';
import { getUserOrganizations } from '../db/queries';
import { workos, clientId } from '@/lib/auth/workos';

export async function createUser(code: string) {
  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });
  let dbUser = await getUserOrganizations(user.id);
  if (!dbUser.length) {
    await db.insert(users).values({ id: user.id });
    dbUser = await getUserOrganizations(user.id);
  }
  return { user, dbUser };
}

