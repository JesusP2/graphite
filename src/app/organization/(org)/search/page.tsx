import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { interFont } from '@/lib/fonts';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { ConfirmRequest } from '@/components/confirm-search';
import { sendOrganizationRequest } from '@/lib/actions/send-organization-request';

export default function Page() {
  return (
    <main className="max-w-lg mx-auto w-full my-10">
      <h1 className={cn('text-xl font-bold', interFont.className)}>
        Search organization
      </h1>
      <form action={sendOrganizationRequest} name="search-org" id="search-org">
        <div className="relative max-w-lg w-full my-4">
          <Input
            name="organizationDomain"
            className="pl-8"
            placeholder="Search organization..."
            type="search"
          />
          <HiMagnifyingGlass className="absolute left-2.5 top-[12px] h-4 w-4 pointer-events-none opacity-50" />
        </div>
        <ConfirmRequest />
      </form>
    </main>
  );
}
