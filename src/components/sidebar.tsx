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
import { useEffect, useState } from 'react';
import { Bungee } from 'next/font/google';

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const hideText = (isOpen: boolean) =>
  cn(isOpen ? 'opacity-100 visible' : 'opacity-0 invisible');

export function Sidebar({ organization }: { organization: string }) {
  const [isOpen, setOpen] = useState(false);
  const [isMouseOver, setMouseOver] = useState(false);
  const [isSidebarPinned, setPinSidebar] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isSidebarPinned) {
      setOpen(true);
      return;
    }
    if (isUserDropdownOpen || isMouseOver) {
      setOpen(true);
    } else if (!isMouseOver) {
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isMouseOver, isUserDropdownOpen, isSidebarPinned]);
  return (
    <aside
      className={cn(
        'bg-white rounded-md duration-200 h-screen overflow-hidden p-4 px-2 text-black flex flex-col justify-between group',
        isOpen ? 'w-72' : 'w-16',
      )}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseOut={() => {
        setMouseOver(false);
      }}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex gap-x-0">
            <p
              className={cn(
                'text-3xl font-bold text-left ml-3 mb-4',
                bungee.className,
              )}
            >
              G
            </p>
            <div
              className={cn(
                'text-3xl font-bold text-left w-full mb-4 whitespace-nowrap duration-300',
                hideText(isOpen),
                bungee.className,
              )}
            >
              aphite
            </div>
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
          <SidebarLink href={`/organization/${organization}/overview`}>
            <GoProject size={22} className="min-w-[22px]" />
            <span
              className={cn(
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
              )}
            >
              Overview
            </span>
          </SidebarLink>
          <SidebarLink href={`/organization/${organization}/projects`}>
            <BsWindowStack size={20} className="min-w-[20px]" />
            <span className={hideText(isOpen)}>Projects</span>
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
                <span className={hideText(isOpen)}>Suites</span>
              </span>
              <FiChevronDown
                size={18}
                className={cn('rotate-180', hideText(isOpen))}
              />
            </CollapsibleTrigger>
            <CollapsibleContent
              className={cn(
                'border-l-[2px] border-slate-200 pl-4 ml-[1.3rem]',
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
              )}
            >
              <SidebarLink href={`/organization/${organization}/suites`}>
                <VscGroupByRefType size={20} className="min-w-[20px]" />
                <span className={hideText(isOpen)}>Suites</span>
              </SidebarLink>
              <SidebarLink href={`/organization/${organization}/suites/runs`}>
                <VscVmRunning size={18} className="min-w-[18px]" />
                <span className={hideText(isOpen)}>Suites runs</span>
              </SidebarLink>
            </CollapsibleContent>
          </Collapsible>
          <SidebarLink href={`/organization/${organization}/activity`}>
            <BsActivity size={20} className="min-w-[20px]" />
            <span className={hideText(isOpen)}>Activity</span>
          </SidebarLink>
        </div>
        <div className="border-t border-dashed border-stone-300 mt-4 pt-4">
          <SidebarLink href={`/organization/${organization}/users`}>
            <HiOutlineUsers size={21} className="min-w-[21px]" />
            <span className={hideText(isOpen)}>Users</span>
          </SidebarLink>
          <SidebarLink href={`/organization/${organization}/settings`}>
            <GoGear size={20} className="min-w-[20px]" />
            <span className={hideText(isOpen)}>Settings</span>
          </SidebarLink>
        </div>
        <div className="border-t border-dashed border-stone-300 mt-4 pt-4">
          <SidebarLink href="/users">
            <HiOutlineUsers size={21} className="min-w-[21px]" />
            <span className={hideText(isOpen)}>Users</span>
          </SidebarLink>
        </div>
      </div>
      <div className="border-t border-dashed border-stone-300 mt-4 pt-4">
        <UserDropdown
          isSidebarOpen={isOpen}
          setUserDropdownOpen={setUserDropdownOpen}
        />
      </div>
    </aside>
  );
}
