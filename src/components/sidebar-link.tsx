'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function SidebarLink({
  href,
  children,
}: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href
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
