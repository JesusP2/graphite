'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';

export const SidebarLink = forwardRef<
  any,
  { href: string; children: React.ReactNode }
>(({ href, children }, ref) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const className = isActive
    ? 'justify-start w-full gap-x-3 px-3'
    : 'justify-start w-full gap-x-3 bg-white font-normal px-3';
  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        buttonVariants({ variant: isActive ? 'default' : 'secondary' }),
        className,
      )}
    >
      {children}
    </Link>
  );
});

SidebarLink.displayName = 'SidebarLink';

export function SidebarLink2({
  href,
  children,
}: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const className = isActive
    ? 'justify-start w-full gap-x-3 px-3'
    : 'justify-start w-full gap-x-3 bg-white font-normal px-3';
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: isActive ? 'default' : 'secondary' }),
        className,
      )}
    >
      {children}
    </Link>
  );
}
