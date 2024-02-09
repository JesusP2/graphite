import { UserOrganization } from '@/lib/db/queries';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function OrganizationItem({
  org,
  isActive,
}: { org: UserOrganization; isActive: boolean }) {
  return (
    <Link
      href={`/organization/${org.domain}/overview`}
      className={cn(
        buttonVariants({ variant: isActive ? 'default' : 'secondary' }),
        isActive
          ? 'py-7'
          : 'h-14 flex items-center px-4 w-full justify-start bg-stone-100 hover:bg-stone-200 focus:bg-stone-200',
      )}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage
          className="w-8 h-8"
          src={org.logo || undefined}
          alt="User avatar"
        />
        <AvatarFallback>{org.name?.[0] || ''}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1">
        <span className="ml-2 text-sm font-semibold text-left">{org.name}</span>
        <span className="ml-2 text-xs font-normal opacity-60 text-left">
          {org.description}
        </span>
      </div>
    </Link>
  );
}
