'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const activeLink =
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm w-40 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground shadow-sm';

const inactiveLink =
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm w-40 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

export function SearchCreateTabs() {
  const pathname = usePathname();
  return (
    <div className="h-10 items-center justify-center rounded-md bg-muted mx-auto max-w-fit w-full p-1 text-muted-foreground">
      <Link
        href="/organization/search"
        className={
          pathname === '/organization/search' ? activeLink : inactiveLink
        }
      >
        Search
      </Link>
      <Link
        href="/organization/create"
        className={
          pathname === '/organization/create' ? activeLink : inactiveLink
        }
      >
        Create
      </Link>
    </div>
  );
}
