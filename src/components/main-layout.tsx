import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { BreadCrumbs } from './bread-crumbs';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Navbar />
      <div className="flex max-w-7xl flex-col gap-8">
        <BreadCrumbs />
        {children}
      </div>
    </div>
  );
};
