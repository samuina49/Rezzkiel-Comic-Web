"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Clock, Megaphone, ChevronRight } from "lucide-react";
import { CreatorFeed } from "@/components/Community/CreatorFeed";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalaxyMap } from "./GalaxyMap";

interface HomeClientProps {
  trending: any[];
  latest: any[];
}

export function HomeClient({ trending, latest }: HomeClientProps) {
  const featured = trending[0] || latest[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-background">
      <Navbar />

      {/* 1. CINEMATIC HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {featured && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
             <img src={featured.coverImageUrl || undefined} className="w-full h-full object-cover" alt="Background" />
             <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
          </motion.div>
        )}

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-12 max-w-5xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-accent text-xs font-black uppercase tracking-[0.4em]">
               <Sparkles className="h-4 w-4 animate-spin-slow" /> Multiverse Synchronized
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-8xl md:text-[14rem] font-black tracking-tighter leading-[0.8] uppercase italic">
              {featured?.title || "REZZKIEL"}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ILLUSION</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-zinc-400 text-xl md:text-3xl font-bold max-w-3xl mx-auto leading-relaxed italic uppercase tracking-tighter">
              Dive into the resonance chamber. Discover high-fidelity lore and interactive chronicles.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-10 pt-8">
               <Link href={`/story/${featured?.id}`} className={cn(buttonVariants({ size: "lg" }), "rounded-full px-20 h-24 text-3xl font-black italic uppercase glow-primary")}>
                  Initiate Sync
               </Link>
               <Link href="/explore" className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "rounded-full px-12 h-24 border-2 border-white/10 text-zinc-300 font-black uppercase italic tracking-widest hover:bg-white/5")}>
                  Discovery
               </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRENDING RESONANCE */}
      <section className="section-container bg-background/50 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic">Trending <br/><span className="text-primary">Resonance</span></h2>
                <div className="h-2 w-48 bg-gradient-to-r from-primary to-transparent rounded-full" />
             </motion.div>
             <Link href="/explore" className="text-accent font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
                Browse Full Library <ChevronRight className="h-5 w-5" />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {trending.slice(0, 3).map((story, idx) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/story/${story.id}`}>
                  <div className="group relative comfort-card aspect-[4/5] overflow-hidden">
                     <img src={story.coverImageUrl || undefined} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                     <div className="absolute top-10 right-10 flex flex-col items-center">
                        <span className="text-6xl font-black text-white/10 italic">0{idx + 1}</span>
                     </div>
                     <div className="absolute bottom-12 left-12 right-12 space-y-4">
                        <span className="px-4 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-[10px] font-black uppercase text-primary tracking-widest">
                           {story.category}
                        </span>
                        <h3 className="text-5xl font-black italic uppercase leading-none truncate group-hover:text-primary transition-colors">{story.title}</h3>
                        <p className="text-zinc-500 text-sm font-bold uppercase truncate">Protocol version: {story.id.slice(0,8)}</p>
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FREQUENCY SELECTION */}
      <section className="section-container bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
           <div className="lg:col-span-12 mb-10">
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic text-center">Select <span className="text-accent underline decoration-8 underline-offset-8">Frequency</span></h2>
           </div>

            <div className="lg:col-span-7">
               <GalaxyMap />
            </div>

            <div className="lg:col-span-5 space-y-10 flex flex-col justify-center">
              <div className="space-y-6 border-l-8 border-accent pl-12">
                 <p className="text-zinc-300 text-3xl md:text-5xl font-black leading-tight italic uppercase tracking-tighter">
                   Calibrate your emotional resonance to specific story frequencies.
                 </p>
                 <p className="text-zinc-500 text-lg md:text-xl font-bold leading-relaxed uppercase tracking-widest mt-6">
                   Whether it's the adrenaline of an active combat log or the subtle resonance of romantic entanglement, the nexus adapts.
                 </p>
              </div>
              <Link href="/explore" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full px-16 h-20 border-2 border-white/10 text-2xl font-black italic uppercase glow-accent")}>
                Full Spectrum Access
              </Link>
           </div>
        </div>
      </section>

      {/* 4. NEXUS TRANSMISSIONS */}
      <section className="section-container bg-background/50">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
               <div className="lg:col-span-8 space-y-16">
                  <div className="flex items-center gap-8 pb-10 border-b-2 border-white/5">
                     <div className="h-20 w-20 rounded-[2rem] bg-background border-2 border-white/10 flex items-center justify-center glow-primary">
                        <Clock className="h-10 w-10 text-primary" />
                     </div>
                     <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">Fresh Signal</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-10">
                     {latest.map((story: any, idx: number) => (
                        <motion.div 
                          key={story.id} 
                          initial={{ opacity: 0, x: -30 }} 
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Link href={`/story/${story.id}`} className="group flex flex-col md:flex-row gap-12 p-12 comfort-card relative overflow-hidden">
                             <div className="h-64 md:h-80 w-full md:w-56 shrink-0 rounded-[2.5rem] overflow-hidden bg-background border-2 border-white/10 shadow-2xl">
                                <img src={story.coverImageUrl || undefined} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                             </div>
                             <div className="flex flex-col justify-center py-4 min-w-0">
                                <div className="flex items-center gap-4 mb-6">
                                   <span className="px-4 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-black text-accent uppercase tracking-widest">ACTIVE SYNC</span>
                                   <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-5xl md:text-7xl font-black line-clamp-1 group-hover:text-accent transition-colors italic uppercase leading-none mb-6">{story.title}</h4>
                                <p className="text-zinc-500 font-bold uppercase tracking-tight italic line-clamp-2 md:text-xl">
                                   Decoding incoming lore packet for sector {story.category}. Signal strength optimal.
                                </p>
                             </div>
                          </Link>
                        </motion.div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-16">
                  <div className="flex items-center gap-8 pb-10 border-b-2 border-white/5">
                     <div className="h-20 w-20 rounded-[2rem] bg-background border-2 border-white/10 flex items-center justify-center glow-accent">
                        <Megaphone className="h-10 w-10 text-accent" />
                     </div>
                     <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">News</h2>
                  </div>
                  <div className="comfort-card p-4">
                    <CreatorFeed compact={true} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. FINALE */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-background">
         <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/20 rounded-full blur-[180px] animate-pulse" />
         </div>

         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-16 relative z-10"
         >
            <Sparkles className="h-32 w-32 text-accent mx-auto glow-accent p-8 rounded-[2.5rem] bg-white/5" />
            <h2 className="text-8xl md:text-[16rem] font-black tracking-[ -0.05em] italic uppercase leading-[0.75]">
              BEYOND THE <span className="text-accent underline decoration-8 underline-offset-16">HORIZON</span>
            </h2>
            <Link href="/explore" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-32 h-28 text-5xl font-black italic uppercase glow-primary")}>
               Finalize Sync
            </Link>
         </motion.div>

         <div className="mt-32 w-full max-w-7xl mx-auto opacity-50">
            <Footer />
         </div>
      </section>

    </div>
  );
}
