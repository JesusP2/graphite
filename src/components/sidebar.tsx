'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VscGroupByRefType } from 'react-icons/vsc';
import { VscVmRunning } from 'react-icons/vsc';
import { GoProject } from 'react-icons/go';
import { FiChevronDown } from 'react-icons/fi';
import { BsActivity } from 'react-icons/bs';
import { BsWindowStack } from 'react-icons/bs';
import { HiOutlineUsers } from 'react-icons/hi2';
import { GoGear } from 'react-icons/go';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { UserDropdown } from '@/components/user-dropdown';
import { SidebarLink } from '@/components/sidebar-link';
import { useState } from 'react';
import { bungeeFont } from '@/lib/fonts';
import { MyOrganizationsDialog } from './my-organizations';
import { UserOrganization } from '@/lib/db/queries';

export function Sidebar({
  organizationDomain,
  userOrganizations,
}: { organizationDomain: string; userOrganizations: UserOrganization[] }) {
  const [isSidebarPinned, setPinSidebar] = useState(false);

  return (
    <aside
      className={cn(
        'bg-white rounded-md duration-200 h-screen overflow-hidden p-4 px-2 text-black flex flex-col justify-between group shadow-lg shadow-neutral-400 sidebar',
      )}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex gap-x-0">
            <span
              className={cn(
                'text-3xl font-bold text-left ml-3 mb-4',
                bungeeFont.className,
              )}
            >
              G
            </span>
            <span
              className={cn(
                'text-3xl font-bold text-left w-full mb-4 whitespace-nowrap duration-300 sidebar-text',
                bungeeFont.className,
              )}
            >
              aphite
            </span>
          </div>
          <button onClick={() => setPinSidebar((prev) => !prev)}>
            {isSidebarPinned ? (
              <TiPin size={20} className="mt-1" />
            ) : (
              <TiPinOutline size={20} className="mt-1" />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-y-2">
          <SidebarLink href={`/organization/${organizationDomain}/overview`}>
            <GoProject size={22} className="min-w-[22px]" />
            <span
              className="sidebar-text"
            >
              Overview
            </span>
          </SidebarLink>
          <SidebarLink href={`/organization/${organizationDomain}/projects`}>
            <BsWindowStack size={20} className="min-w-[20px]" />
            <span className="sidebar-text">Projects</span>
          </SidebarLink>
          <Collapsible>
            <CollapsibleTrigger
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'justify-between w-full gap-x-3 bg-white font-normal px-3',
              )}
            >
              <span className="flex gap-x-3">
                <VscGroupByRefType
                  size={20}
                  className="min-w-[20px] min-h-[20px]"
                />
                <span className="sidebar-text">Suites</span>
              </span>
              <FiChevronDown
                size={18}
                className={cn('rotate-180 sidebar-text')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent
              className={cn(
                'border-l-[2px] border-slate-200 pl-4 ml-[1.3rem] sidebar-text',
              )}
            >
              <SidebarLink href={`/organization/${organizationDomain}/suites`}>
                <VscGroupByRefType size={20} className="min-w-[20px]" />
                <span className="sidebar-text">Suites</span>
              </SidebarLink>
              <SidebarLink href={`/organization/${organizationDomain}/suites/runs`}>
                <VscVmRunning size={18} className="min-w-[18px]" />
                <span className="sidebar-text">Suites runs</span>
              </SidebarLink>
            </CollapsibleContent>
          </Collapsible>
          <SidebarLink href={`/organization/${organizationDomain}/activity`}>
            <BsActivity size={20} className="min-w-[20px]" />
            <span className="sidebar-text">Activity</span>
          </SidebarLink>
        </div>
        <div className="border-t border-dashed border-stone-300 mt-4 pt-4">
          <SidebarLink href={`/organization/${organizationDomain}/users`}>
            <HiOutlineUsers size={21} className="min-w-[21px]" />
            <span className="sidebar-text">Users</span>
          </SidebarLink>
          <SidebarLink href={`/organization/${organizationDomain}/settings`}>
            <GoGear size={20} className="min-w-[20px]" />
            <span className="sidebar-text">Settings</span>
          </SidebarLink>
        </div>
        <div className="border-t border-dashed border-stone-300 mt-4 pt-4">
          <MyOrganizationsDialog
            organizationDomain={organizationDomain}
            userOrganizations={userOrganizations}
          />
        </div>
      </div>
      <div className="border-t border-dashed border-stone-300 mt-4 pt-4 child">
        <UserDropdown />
      </div>
    </aside>
  );
}
