import { getAuthorizationUrl } from '@/lib/auth';

export default async function Home() {
  const authorizationUrl = getAuthorizationUrl();
  // const user = await getUser();
  return (
  <div>hello</div>
  );
}

// users (organization)
// configuration (organization)
//
// projects
// suites
// - suites
// - runs
// cronjobs (general view of all cronjobs)
// comments (general view of all comments)
//
//
//
// organization
// projects
// suites
// tests
// steps
// tests_runs
// suites_runs
// cronjobs
// comments
