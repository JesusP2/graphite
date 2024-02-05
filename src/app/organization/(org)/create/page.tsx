import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { interFont } from '@/lib/fonts';
import { ConfirmRequest } from '@/components/confirm-search';
import { createOrganization } from '@/lib/actions/create-organziation';

export default function Page() {
  return (
    <main className="max-w-lg mx-auto w-full my-10">
      <h1 className={cn('text-xl font-bold', interFont.className)}>
        Create organization
      </h1>
      <form
        action={createOrganization}
        name="search-org"
        id="search-org"
      >
        <div className="max-w-lg w-full my-4 flex flex-col gap-y-2">
          <Input name="organizationName" placeholder="Name" />
          <Input name="organizationDomain" placeholder="Domain" />
          <Input
            name="organizationDescription"
            placeholder="Short description"
          />
        </div>
        <ConfirmRequest />
      </form>
    </main>
  );
}
