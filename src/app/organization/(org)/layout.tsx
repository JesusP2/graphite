import { ReactNode } from 'react';
import { SearchCreateTabs } from '@/components/search-create-tabs';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <aside className="mt-10">
        <SearchCreateTabs />
      </aside>
      {children}
    </>
  );
}
