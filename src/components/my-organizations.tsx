'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarLink } from './sidebar-link';
import { HiOutlineUsers } from 'react-icons/hi2';
import Link from 'next/link';
import { X } from 'lucide-react';
import { UserOrganization } from '@/lib/db/queries';
import { OrganizationItem } from './organization-item';
import { IoAddCircleOutline } from 'react-icons/io5';

const hideText = (isOpen: boolean) =>
  cn(isOpen ? 'opacity-100 visible' : 'opacity-0 invisible');

export function MyOrganizationsDialog({
  isSidebarOpen,
  organizationDomain,
  userOrganizations,
}: {
  isSidebarOpen: boolean;
  organizationDomain: string;
  userOrganizations: UserOrganization[];
}) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.has('isMyOrganizationsOpen');
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Dialog open={isOpen && isClient}>
      <DialogTrigger asChild>
        <SidebarLink href={pathname + '?isMyOrganizationsOpen=true'}>
          <HiOutlineUsers size={21} className="min-w-[21px]" />
          <span className={hideText(isSidebarOpen)}>My organizations</span>
        </SidebarLink>
      </DialogTrigger>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>My Organizations</DialogTitle>
          <DialogDescription>
            Change the organization you are currently viewing
          </DialogDescription>
        </DialogHeader>
        <div className="gap-y-4 grid overflow-y-auto max-h-[300px] my-organizations-list-dialog">
          {userOrganizations.map((org) => (
            <OrganizationItem
              org={org}
              isActive={org.domain == organizationDomain}
              key={org.orgId}
            />
          ))}
        </div>
        <Link
          href="/organization/create"
          className="py-4 rounded-md flex bg-stone-50 hover:text-stone-600 hover:bg-stone-100 px-4 gap-x-4 items-center text-stone-500"
        >
          <IoAddCircleOutline size={21} className="min-w-[21px]" />
          Create new organization
        </Link>
        <DialogFooter className="mt-2">
          <Link
            href={pathname}
            className={buttonVariants({ variant: 'secondary' })}
          >
            Cancel
          </Link>
        </DialogFooter>
        <DialogPrimitive.Close asChild>
          <Link
            href={pathname}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Link>
        </DialogPrimitive.Close>
      </DialogContent>
    </Dialog>
  );
}
