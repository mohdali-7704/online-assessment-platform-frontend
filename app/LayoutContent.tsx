'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { migrateUsersToCandidates, cleanupOldUsersData } from '@/lib/utils/migrateUsersToCandidates';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // Run data migration on app initialization
  useEffect(() => {
    const migrated = migrateUsersToCandidates();
    if (migrated) {
      cleanupOldUsersData();
    }
  }, []);

  return (
    <>
      {!isLoginPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
}
