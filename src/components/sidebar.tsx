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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { UserDropdown } from '@/components/user-dropdown';
import { SidebarLink } from '@/components/sidebar-link';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const [isOpen, setOpen] = useState(false);
  const [isMouseOver, setMouseOver] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isUserDropdownOpen || isMouseOver) {
      setOpen(true);
    } else if (!isMouseOver) {
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isMouseOver, isUserDropdownOpen]);
  return (
    <aside
      className={cn(
        'bg-white rounded-md duration-100 h-screen overflow-hidden p-4 px-2 text-black flex flex-col justify-between group',
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
        <div className="flex flex-col gap-y-2">
          <SidebarLink href="/overview">
            <GoProject size={22} className="min-w-[22px]" />
            <span className={cn(isOpen ? '' : 'hidden')}>Overview</span>
          </SidebarLink>
          <SidebarLink href="/projects">
            <BsWindowStack size={20} className="min-w-[20px]" />
            <span className={cn(isOpen ? '' : 'hidden')}>Projects</span>
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
                <span className={cn(isOpen ? '' : 'hidden')}>Suites</span>
              </span>
              <FiChevronDown
                size={18}
                className={cn('rotate-180', isOpen ? '' : 'hidden')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent
              className={cn(
                'border-l-[2px] border-slate-200 pl-4 ml-[1.3rem]',
                isOpen ? '' : 'hidden',
              )}
            >
              <SidebarLink href="/suites">
                <VscGroupByRefType size={20} className="min-w-[20px]" />
                <span className={cn(isOpen ? '' : 'hidden')}>Suites</span>
              </SidebarLink>
              <SidebarLink href="/suites/runs">
                <VscVmRunning size={18} className="min-w-[18px]" />
                <span className={cn(isOpen ? '' : 'hidden')}>Suites runs</span>
              </SidebarLink>
            </CollapsibleContent>
          </Collapsible>
          <SidebarLink href="/activity">
            <BsActivity size={20} className="min-w-[20px]" />
            <span className={cn(isOpen ? '' : 'hidden')}>Activity</span>
          </SidebarLink>
        </div>
        <div className="border-t border-dashed border-stone-300 mt-4 pt-4">
          <SidebarLink href="/users">
            <HiOutlineUsers size={21} className="min-w-[21px]" />
            <span className={cn(isOpen ? '' : 'hidden')}>Users</span>
          </SidebarLink>
          <SidebarLink href="/settings">
            <GoGear size={20} className="min-w-[20px]" />
            <span className={cn(isOpen ? '' : 'hidden')}>Settings</span>
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
