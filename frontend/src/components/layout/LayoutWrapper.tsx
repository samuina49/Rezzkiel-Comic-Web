"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="relative flex min-h-screen flex-col selection:bg-primary/30">
      {!isHome && <Navbar />}
      <main className="flex-1 bg-background">
        {children}
      </main>
      {!isHome && <Footer />}
    </div>
  );
}
