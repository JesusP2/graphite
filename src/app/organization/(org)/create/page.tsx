'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { interFont } from '@/lib/fonts';
import { ConfirmRequest } from '@/components/confirm-search';
import { createOrganization } from '@/lib/actions/create-organziation';
import { useFormState } from 'react-dom';

const initialState = {
  organizationName: {
    value: '',
    error: null as string | null,
  },
  organizationDomain: {
    value: '',
    error: null as string | null,
  },
  organizationDescription: {
    value: '',
    error: null as string | null,
  },
}
export default function Page() {
  const [state, formAction] = useFormState<typeof initialState, any>(createOrganization, initialState)
  useFormState
  return (
    <main className="max-w-lg mx-auto w-full my-10">
      <h1 className={cn('text-xl font-bold', interFont.className)}>
        Create organization
      </h1>
      <form action={formAction} name="search-org" id="search-org">
        <div className="max-w-lg w-full my-4 flex flex-col gap-y-2">
          <Input
            name="organizationName"
            placeholder="Name"
            className={cn(state.organizationName.error ? 'border-red-500 placeholder:text-red-500 text-red-500' : '')}
          />
          <span className="text-xs text-red-500 ml-2">{state.organizationName.error}</span>
          <Input
            name="organizationDomain"
            placeholder="Domain"
            className={cn(state.organizationDomain.error ? 'border-red-500 placeholder:text-red-500 text-red-500' : '')}
          />
          <span className="text-xs text-red-500 ml-2">{state.organizationDomain.error}</span>
          <Input
            name="organizationDescription"
            placeholder="Short description"
            className={cn(state.organizationDescription.error ? 'border-red-500 placeholder:text-red-500 text-red-500' : '')}
          />
          <span className="text-xs text-red-500 ml-2">{state.organizationDescription.error}</span>
        </div>
        <ConfirmRequest />
      </form>
    </main>
  );
}
