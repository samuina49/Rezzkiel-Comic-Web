"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shield, Megaphone, BookOpen, CreditCard, ChevronRight, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "Admin") {
        router.push("/");
      } else {
        setAuthorized(true);
      }
    }
  }, [user, isLoading, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs animate-pulse">Scanning Admin Privileges...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Broadcast Station", href: "/admin/news", icon: Megaphone, color: "text-accent" },
    { name: "Comic Management", href: "/admin/stories", icon: BookOpen, color: "text-primary" },
    { name: "Commerce Systems", href: "/admin/purchases", icon: CreditCard, color: "text-zinc-600", disabled: true },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto py-12 px-4 lg:px-12 flex flex-col lg:flex-row gap-12 flex-1">
        
        {/* COMMAND SIDEBAR */}
        <aside className="w-full lg:w-80 shrink-0 space-y-10">
          <div className="flex items-center gap-4 px-4">
             <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
                <Shield className="h-6 w-6 text-primary" />
             </div>
             <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Command</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Center Alpha</span>
             </div>
          </div>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              if (item.disabled) {
                return (
                  <div key={item.name} className="flex items-center gap-4 p-6 rounded-[2rem] bg-card/20 border border-white/5 opacity-40 cursor-not-allowed">
                    <Icon className="h-6 w-6" />
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase italic">{item.name}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Signal Offline</p>
                    </div>
                  </div>
                );
              }

              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 p-6 rounded-[2.5rem] transition-all border-2 group",
                    isActive 
                      ? "bg-primary/10 border-primary/30 glow-primary" 
                      : "bg-card border-white/5 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                    isActive ? "bg-primary text-white" : "bg-background text-zinc-500 group-hover:text-white"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-md font-black uppercase italic leading-none", isActive ? "text-primary" : "text-zinc-400 group-hover:text-white")}>
                      {item.name}
                    </p>
                  </div>
                  <ChevronRight className={cn("h-5 w-5 transition-all text-zinc-800", isActive ? "text-primary translate-x-1" : "group-hover:translate-x-1")} />
                </Link>
              );
            })}
          </nav>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-background to-card/50 border border-white/10 space-y-4">
             <div className="h-1 w-12 bg-primary rounded-full" />
             <p className="text-xs font-bold text-zinc-500 italic uppercase">System ready. Multiverse updates will be broadcasted across all synced nodes.</p>
          </div>
        </aside>

        {/* COMMAND INTERFACE */}
        <main className="flex-1 min-w-0">
          <div className="comfort-card h-full min-h-[70vh] relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none select-none">
                <Shield className="h-96 w-96" />
             </div>
             <div className="relative z-10 p-4 lg:p-12 flex-1">
                {children}
             </div>
          </div>
        </main>

      </div>
    </div>
  );
}
