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
import { cn } from '@/lib/utils';

export function UserDropdown() {
  return (
    <DropdownMenu>
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
            className={cn('flex flex-col flex-1 sidebar-text')}
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
            className="sidebar-text"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-menu-has-content">
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
