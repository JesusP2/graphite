import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FiChevronRight } from 'react-icons/fi';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';

export function UserDropdown({
  isSidebarOpen,
  setUserDropdownOpen,
}: {
  isSidebarOpen: boolean;
  setUserDropdownOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        setUserDropdownOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="h-14 flex items-center px-2 w-full justify-start bg-stone-50 hover:bg-stone-100 focus:bg-stone-100"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage
              className="w-8 h-8"
              src="https://pbs.twimg.com/profile_images/864164353771229187/Catw6Nmh_400x400.jpg"
              alt="User avatar"
            />
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
          <div
            className={cn('flex-col flex-1', isSidebarOpen ? 'flex' : 'hidden')}
          >
            <span className="ml-2 text-sm font-semibold text-left">
              Jesus Perez
            </span>
            <span className="ml-2 text-xs font-normal opacity-60 text-left">
              jesusprzprz.e@gmail.com
            </span>
          </div>
          <FiChevronRight
            size={18}
            className={cn(isSidebarOpen ? '' : 'hidden')}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
