// This example uses Next.js with React Server Components.
import { workos, clientId } from '@/lib/auth/workos';
import { envs } from '../env-vars';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import type { User } from '@workos-inc/node';
import crypto from 'crypto';
import { db } from '../db/connection';
import { users, usersToOrganizations } from '../db/schema';
import { eq } from 'drizzle-orm';

export function getAuthorizationUrl() {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: 'authkit',

    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: envs.GOOGLE_CALLBACK_URL,
    clientId,
  });

  return authorizationUrl;
}

/* 
  Because RSC allows running code on the server, you can
  call `getAuthorizationUrl()` directly within a server component:

  function SignInButton() {
    const authorizationUrl = getAuthorizationUrl();
    return <a href={authorizationUrl}>Sign In</a>;
  }
*/

export function getJwtSecretKey() {
  const secret = envs.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not set');
  }

  return new Uint8Array(Buffer.from(secret, 'base64'));
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUser(): Promise<{
  isAuthenticated: boolean;
  user?: User | null;
}> {
  const token = cookies().get('token')?.value;

  if (token) {
    const verifiedToken = await verifyJwtToken(token);
    if (verifiedToken) {
      return {
        isAuthenticated: true,
        user: verifiedToken.user as User | null,
      };
    }
  }

  return { isAuthenticated: false };
}

export async function signOut() {
  cookies().delete('token');
  redirect('/using-hosted-authkit/with-session');
}

export async function getDbUser(userId: string) {
  return db
    .select({ id: users.id, org_id: usersToOrganizations.orgId, role: usersToOrganizations.role })
    .from(users)
    .where(eq(users.id, userId))
    .leftJoin(usersToOrganizations, eq(usersToOrganizations.userId, userId));
}
export async function createUser(code: string) {
  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });
  let dbUser = await getDbUser(user.id);
  if (!dbUser.length) {
    await db.insert(users).values({ id: user.id });
    dbUser = await getDbUser(user.id);
  }
  return { user, dbUser };
}
