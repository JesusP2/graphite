'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { interFont } from '@/lib/fonts';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { ConfirmRequest } from '@/components/confirm-search';
import { createInitialState, sendOrganizationRequest } from '@/lib/actions/send-organization-request';
import { useFormState } from 'react-dom';

const initialState = {
  organizationDomain: {
    value: '',
    error: null as string | null,
  }
}

export default function Page() {
  const [state, formAction] = useFormState<typeof initialState, any>(sendOrganizationRequest, initialState)
  return (
    <main className="max-w-lg mx-auto w-full my-10">
      <h1 className={cn('text-xl font-bold', interFont.className)}>
        Search organization
      </h1>
      <form action={formAction} name="search-org" id="search-org">
        <div className={cn('relative max-w-lg w-full mt-4', state.organizationDomain.error ? 'border-red-500 placeholder:text-red-500 text-red-500' : '')}>
          <Input
            name="organizationDomain"
            placeholder="Search organization..."
            className='pl-8' 
            type="search"
          />
          <HiMagnifyingGlass className="absolute left-2.5 top-[12px] h-4 w-4 pointer-events-none opacity-50" />
        </div>
        <span className="text-xs text-red-500 ml-2">{state.organizationDomain.error}</span>
        <div className="h-4 w-10" />
        <ConfirmRequest />
      </form>
    </main>
  );
}
