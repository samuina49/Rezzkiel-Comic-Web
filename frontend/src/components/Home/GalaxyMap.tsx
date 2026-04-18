"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Flame, Heart, Ghost, Smile, Atom, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

const GENRES = [
  { name: "General", icon: <Sparkles />, color: "rgba(99, 102, 241, 0.5)", orbit: 240, speed: 25, delay: 0 },
  { name: "Action", icon: <Zap />, color: "rgba(239, 68, 68, 0.5)", orbit: 340, speed: 35, delay: 2 },
  { name: "Romance", icon: <Heart />, color: "rgba(236, 72, 153, 0.5)", orbit: 440, speed: 45, delay: 4 },
  { name: "Fantasy", icon: <Flame />, color: "rgba(245, 158, 11, 0.5)", orbit: 240, speed: 30, delay: 5 },
  { name: "Horror", icon: <Ghost />, color: "rgba(139, 92, 246, 0.5)", orbit: 540, speed: 55, delay: 1 },
  { name: "Comedy", icon: <Smile />, color: "rgba(34, 197, 94, 0.5)", orbit: 340, speed: 20, delay: 3 },
  { name: "Sci-Fi", icon: <Atom />, color: "rgba(20, 184, 166, 0.5)", orbit: 640, speed: 60, delay: 6 },
];
export function GalaxyMap() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<{top: string, left: string, duration: number}[]>([]);
  const [isWarping, setIsWarping] = useState(false);
  const [warpColor, setWarpColor] = useState("rgba(99, 102, 241, 0.5)");

  useEffect(() => {
    setMounted(true);
    const newStars = [...Array(30)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 2
    }));
    setStars(newStars);
  }, []);

  const handlePlanetClick = (e: React.MouseEvent, url: string, color: string) => {
    e.preventDefault();
    if (isWarping) return;
    
    setWarpColor(color);
    setIsWarping(true);
    
    // Cinematic delay before navigation
    setTimeout(() => {
      router.push(url);
    }, 1200);
  };

  if (!mounted) return <div className="relative w-full h-[600px] md:h-[800px] bg-background/50 rounded-[4rem] border border-white/5" />;

  return (
    <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden bg-background/50 rounded-[4rem] border border-white/5">

      {/* HYPER WARP OVERLAY - CINEMATIC VERSION */}
      <AnimatePresence>
        {isWarping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden bg-background/50 backdrop-blur-sm"
          >
             {/* 1. AMBIENT LIGHT BLOOM (Softer Flare) */}
             <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 2, 4], 
                  opacity: [0, 0.4, 0],
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute h-64 w-64 md:h-96 md:w-96 rounded-full blur-[120px]"
                style={{ backgroundColor: warpColor }}
             />
             
             {/* 2. RADIAL STARBURST (Hyperspace Lines - Softened) */}
             {[...Array(50)].map((_, i) => {
               const angle = Math.random() * Math.PI * 2;
               const radius = 2000;
               const tx = Math.cos(angle) * radius;
               const ty = Math.sin(angle) * radius;
               
               return (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.2, 2],
                      x: [0, tx],
                      y: [0, ty],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{ 
                      duration: 0.9, 
                      repeat: Infinity, 
                      delay: Math.random() * 0.4,
                      ease: "easeIn" 
                    }}
                    className="absolute h-[1px] w-48 rounded-full origin-left opacity-30"
                    style={{ 
                      backgroundColor: warpColor,
                      rotate: `${angle}rad`,
                      boxShadow: `0 0 10px ${warpColor}`,
                      background: `linear-gradient(to right, transparent, ${warpColor}, rgba(255,255,255,0.3))`
                    }}
                  />
               )
             })}

             {/* 3. WARP TEXT HUD */}
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="relative z-10 text-center"
             >
                <div className="flex flex-col items-center gap-4">
                   <Rocket className="h-12 w-12 text-white animate-bounce" />
                   <div className="text-white font-black italic uppercase tracking-[1.5em] text-2xl md:text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                     LOADING
                   </div>
                   <div className="h-1 w-64 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1 }}
                        className="h-full bg-white shadow-[0_0_15px_white]"
                      />
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={isWarping ? { scale: 10, opacity: 0, filter: "blur(20px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "circIn" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 1. THE NEXUS CORE (Overhauled) */}
        <div className="relative z-20 flex items-center justify-center">
           {/* ... existing core content ... */}
           <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute h-56 w-56 md:h-80 md:w-80 rounded-full border border-dashed border-primary/30 opacity-40"
           />
           <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute h-48 w-48 md:h-64 md:w-64 rounded-full border border-primary/20 opacity-30 shadow-[0_0_50px_rgba(99,102,241,0.1)]"
           />
           
           <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 40px rgba(99, 102, 241, 0.4)",
                "0 0 80px rgba(99, 102, 241, 0.6)",
                "0 0 40px rgba(99, 102, 241, 0.4)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative h-24 w-24 md:h-36 md:w-36 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white/20 backdrop-blur-xl group overflow-hidden rotate-45"
           >
              <div className="-rotate-45 text-center">
                 <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                 >
                    <Sparkles className="h-10 w-10 md:h-14 md:w-14 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                 </motion.div>
              </div>
              
              <motion.div 
                animate={{ top: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-white/20 blur-sm"
              />
           </motion.div>
           
           <div className="absolute -bottom-16 text-center">
              <h3 className="text-xl font-black italic uppercase tracking-[0.5em] text-white opacity-80">Rezzkiel</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                 <div className="h-1 w-8 bg-primary rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Core Active</span>
                 <div className="h-1 w-8 bg-accent rounded-full" />
              </div>
           </div>
        </div>

        {/* 2. THE ORBITAL SYSTEM */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {GENRES.map((genre, idx) => (
            <div 
              key={genre.name} 
              className="absolute orbit-line" 
              style={{ 
                width: `${genre.orbit}px`, 
                height: `${genre.orbit}px`,
                opacity: 0.1 + (idx * 0.05)
              }} 
            />
          ))}
        </div>

        {/* 3. THE PLANETS (Interactive Links) */}
        {GENRES.map((genre) => (
          <motion.div
             key={genre.name}
             className="absolute pointer-events-none z-30"
             initial={{ rotate: genre.delay * 40 }}
             animate={{ rotate: 360 + (genre.delay * 40) }}
             transition={{ 
               duration: genre.speed, 
               repeat: Infinity, 
               ease: "linear" 
             }}
             style={{ width: `${genre.orbit}px`, height: `${genre.orbit}px` }}
          >
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{ rotate: `-${genre.delay * 10}deg` }}
            >
              <Link 
                href={`/explore?category=${genre.name}`}
                onClick={(e) => handlePlanetClick(e, `/explore?category=${genre.name}`, genre.color)}
              >
                 <motion.div 
                    whileHover={{ scale: 1.5, zIndex: 100 }}
                    className="group relative flex flex-col items-center"
                 >
                    <div 
                      className="h-12 w-12 md:h-18 md:w-18 rounded-full flex items-center justify-center glow-planet border border-white/20 transition-all duration-500 bg-background/80 backdrop-blur-md group-hover:border-white shadow-2xl relative overflow-hidden"
                      style={{ '--planet-color': genre.color } as any}
                    >
                       <div className="text-lg md:text-2xl relative z-10">{genre.icon}</div>
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
                    </div>

                    <div className="absolute top-full mt-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none text-center">
                       <div className="px-4 py-2 bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                          <h4 className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: genre.color }}>{genre.name}</h4>
                          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-1" />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">ENGAGE RESONANCE</span>
                       </div>
                    </div>
                 </motion.div>
              </Link>
            </div>
          </motion.div>
        ))}

        {/* Background Star Ambience */}
        <div className="absolute inset-0 z-0">
            {stars.map((star, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: star.duration, repeat: Infinity }}
                className="absolute h-1 w-1 bg-white rounded-full"
                style={{ 
                  top: star.top, 
                  left: star.left
                }}
              />
            ))}
        </div>
      </motion.div>
    </div>
  );
}
