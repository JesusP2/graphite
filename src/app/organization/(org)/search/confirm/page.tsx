'use client';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CiCircleCheck } from 'react-icons/ci';
import { MdOutlineErrorOutline } from 'react-icons/md';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const organizationDomain = searchParams.get('organizationDomain');
  const error = searchParams.get('error');
  if (error === 'already-requested') {
    return <AlreadyRequestedError organizationDomain={organizationDomain!} />;
  } else if (error === 'invalid-domain') {
    return <InvalidDomainError organizationDomain={organizationDomain!} />;
  } else {
    return <Success organizationDomain={organizationDomain!} />;
  }
}

function InvalidDomainError({ organizationDomain }: { organizationDomain: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10">
      <MdOutlineErrorOutline className="h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold">Invalid Domain</h1>
      <p className="text-gray-500 dark:text-gray-400">
        The domain <span className="font-bold">{organizationDomain}</span> is invalid. Please try again.
      </p>
      <Link
        className={buttonVariants({ variant: 'default' })}
        href="/organization/search"
      >
        Go back to search
      </Link>
    </div>
  );
}

function AlreadyRequestedError({ organizationDomain }: { organizationDomain: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10">
      <MdOutlineErrorOutline className="h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold">Request Failed</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Your request to{' '}
        <span className="font-bold">{organizationDomain}</span> has failed. Please
        try again.
      </p>
      <Link
        className={buttonVariants({ variant: 'default' })}
        href="/organization/search"
      >
        Go back to search
      </Link>
    </div>
  );
}

function Success({ organizationDomain }: { organizationDomain: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10">
      <CiCircleCheck className="h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold">Request Sent</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Your request has been successfully submitted to{' '}
        <span className="font-bold">{organizationDomain}</span>. We will get
        back to you soon.
      </p>
      <Link
        className={buttonVariants({ variant: 'default' })}
        href="/organization/search"
      >
        Go back to search
      </Link>
    </div>
  );
}
