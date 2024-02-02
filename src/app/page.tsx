import { getAuthorizationUrl } from "@/lib/auth";
import { Button } from "@radix-ui/themes";
import { getUser } from "@/lib/auth";

export default async function Home() {
  const authorizationUrl = getAuthorizationUrl();
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <a href={authorizationUrl}>Log in</a>
      {JSON.stringify(user.user)}
    </main>
  );
}
