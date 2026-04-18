"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { User, Shield, LogOut, LayoutDashboard, Search, Megaphone, Compass, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b-2 border-white/5 shadow-2xl"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-12">
        <Link href="/" className="flex items-center gap-2 group">
           <motion.div 
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
           >
              <div className="h-4 w-4 bg-black rounded-sm animate-pulse" />
           </motion.div>
           <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase italic leading-none group-hover:text-primary transition-colors">
                REZZKIEL <span className="text-zinc-600">ILLUSION</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.4em] text-primary uppercase ml-0.5">Multiverse Nexus</span>
           </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link href="/explore" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
            <Compass className="h-4 w-4" /> Discovery
          </Link>
          <Link href="/library" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
            <BookOpen className="h-4 w-4" /> Archives
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                   <span className="text-xs font-black uppercase tracking-tight">{user.displayName || user.email.split('@')[0]}</span>
                   <span className="text-[8px] text-primary font-black uppercase tracking-[0.2em]">{user.role} CORE</span>
                </div>

                <Link href="/profile" className="h-11 w-11 rounded-xl bg-zinc-900 border-2 border-white/5 overflow-hidden shadow-2xl hover:border-primary transition-all">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                       <User className="h-5 w-5 text-zinc-600" />
                    </div>
                  )}
                </Link>

                <div className="flex items-center gap-2">
                  {user.role === 'Admin' && (
                    <Link href="/admin/news" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-zinc-500 hover:text-primary")}>
                      <Megaphone className="h-5 w-5" />
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={logout} className="text-zinc-600 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs font-black uppercase tracking-widest text-zinc-400")}>
                  Login
                </Link>
                <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] px-8 hover:scale-105 active:scale-95 transition-transform shadow-xl")}>
                  Sync
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
}

