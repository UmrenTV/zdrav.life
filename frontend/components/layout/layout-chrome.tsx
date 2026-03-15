'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const MAINTENANCE_PATH = '/maintenance';

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMaintenance = pathname === MAINTENANCE_PATH;

  if (isMaintenance) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-x-hidden">
      <Navbar />
      <main className="min-w-0 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
